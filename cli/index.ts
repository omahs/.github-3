import prompt from "prompts";

const commands = [
    { title: "deploy", description: "Deploy a Solana program.", value: async (): Promise<unknown> => import("./deploy.js") }
];

const response = await prompt({
    type: "select",
    name: "handler",
    message: "Select a command",
    choices: commands
}) as { handler: () => Promise<unknown> };

await response.handler();
