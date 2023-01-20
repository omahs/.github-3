import { MailType } from "jewl-core";
import { Mail, MailState } from "jewl-core";
import { readFile } from "fs";
import { resolve, dirname } from "path";
import { createTransport } from "nodemailer";
import { authClient } from "../modules/network.js";
import { convert } from "html-to-text";

const smtpName = process.env.SMTP_NAME ?? "";

const openTemplate = async (name: string): Promise<string> => {
    const fullPath = resolve(dirname(""), "src", "templates", `${name}.html`);
    return new Promise((res, rej) => {
        readFile(fullPath, "utf8", (err, data) => {
            if (err != null) { rej(err); return; }
            res(data);
        });
    });
};

const subjects: Record<string, string> = {
    welcome: `Welcome to ${smtpName}!`
};

const getContent = async (type: MailType, data: Record<string, string>): Promise<string> => {
    let template = await openTemplate(MailType[type]);
    const matches = template.matchAll(/\$\w*/ug);
    for (const match of matches) {
        template = template.replaceAll(match[0], data[match[1]]);
    }
    return template;
};

const sendMail = async (email: string, subject: string, body: string): Promise<string> => {
    const transporter = createTransport({
        host: process.env.SMTP_HOST ?? "",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER ?? "",
            pass: process.env.SMTP_PASS ?? ""
        }
    });

    const info = await transporter.sendMail({
        from: `"${smtpName}" <noreply@jewl.app>`,
        to: email,
        subject,
        text: convert(body),
        html: body
    });

    return info.messageId;
};

export const mailJob = async (): Promise<void> => {
    const header = await openTemplate("header");
    const footer = await openTemplate("footer");
    const cursor = Mail.find({ state: MailState.pending }).cursor();
    for await (const mail of cursor) {
        const authUser = await authClient.getUser(mail.userId);

        const content = await getContent(mail.type, mail.data);
        const body = [header, footer, content].join("\n");
        const subject = subjects[MailType[mail.type]];

        mail.state = MailState.sent;
        await mail.save();

        const id = await sendMail(authUser.email, subject, body);

        mail.mailId = id;
        await mail.save();
    }
};
