import createError from "http-errors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import indexRouter from "./routes/index";
import docsRouter from "./routes/docs";

const app: Application = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/", indexRouter);
app.use("/docs", docsRouter);

app.use((req, res, next) => {
    next(createError(404));
});

// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

app.listen(2999);