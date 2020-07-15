// 配置地址转换
const alias = require("module-alias");

alias.addAlias("@", __dirname);

import userCon from "@/controller/UserCtrl";
import browseCtr from "@/controller/BrowseCtrl";
import logger from "@/utils/Logger";
import express, { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "./utils/constants";

// 启动Server
const app = express();

app.use(express.urlencoded({ extended: true }));

// 记录请求
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(
        `收到请求:路径:${req.url} 方式:${req.method} 内容:${JSON.stringify(
            req.method == "GET" ? req.query : req.body
        )}`
    );
    next();
});

app.use("/user", userCon);

app.use("/browse", browseCtr);

// 错误处理
app.use(
    (
        error: HttpStatusCode,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        res.sendStatus(error);
        logger.logError(
            `错误:路径:${req.url} 方式:${req.method} 内容:${JSON.stringify(
                req.method == "GET" ? req.query : req.body
            )} ${HttpStatusCode[error]}`
        );
        next();
    }
);

app.listen("8080");
