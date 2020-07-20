// source map 对应
require("source-map-support").install();

// 配置地址转换
const alias = require("module-alias");

alias.addAlias("@", __dirname);

import browseCtrl from "@/controller/BrowseCtrl";
import constantCtrl from "@/controller/ConstantCtrl";
import createCtrl from "@/controller/CreateCtrl";
import userCtrl from "@/controller/UserCtrl";
import communityCtrl from "@/controller/CommunityCtrl";
import logger from "@/utils/Logger";
import express, { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "./utils/constants";
import FileStorage from "./utils/FileStorage";

// 初始化文件夹
FileStorage.init();
FileStorage.cleanPreviewFolder();

// 启动Server
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 记录请求
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`收到请求:路径:${req.url} 方式:${req.method}`);
    next();
});

app.use("/novel", express.static("public/novel"));

app.use("/user", userCtrl);

app.use("/browse", browseCtrl);

app.use("/create", createCtrl);

app.use("/constant", constantCtrl);

app.use("/community", communityCtrl);

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
            `路径:${req.url} 方式:${req.method} 内容:${JSON.stringify(
                req.method == "GET" ? req.query : req.body
            )} ${HttpStatusCode[error]}`
        );
        next();
    }
);

app.listen("8080");
