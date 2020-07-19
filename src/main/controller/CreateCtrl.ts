import ReqLimiter from "@/midWare/ReqLimiter";
import TokenManager from "@/midWare/TokenManager";
import Story from "@/model/Story";
import User from "@/model/User";
import { Transpiler } from "@/utils/Transpiler";
import express from "express";
import { Thread, Worker, spawn } from "threads";
import { HttpStatusCode } from "@/utils/constants";
import Logger from "@/utils/Logger";

let router = express.Router();

router.post(
    "/upload",
    TokenManager.validate(),
    ReqLimiter.limit(["title", "pages", "cover"]),
    ReqLimiter.initEntity(Story),
    async (req, res, next) => {
        let story: Story = res.locals.story;
        story.author = res.locals.currentUser as User;
        await story.save();
        story.compile();
        res.sendStatus(200);
        next();
    }
);

router.post(
    "/preview",
    TokenManager.validate(),
    ReqLimiter.limit(["title", "pages", "cover"]),
    ReqLimiter.initEntity(Story),
    async (req, res, next) => {
        let story: Story = res.locals.story;
        story.author = res.locals.currentUser as User;
        let viewURL = await story.compile(true);
        if (viewURL == undefined) next(HttpStatusCode.转换出错);
        else {
            res.send(viewURL);
            next();
        }
    }
);

router.post(
    "/previewPage",
    TokenManager.validate(),
    ReqLimiter.limit(["components"]),
    async (req, res, next) => {
        let worker = await spawn<Transpiler>(new Worker("../utils/Transpiler"));
        let html;
        try {
            html = await worker.generateOnePage(req.body);
        } catch (e) {
            Logger.logError(e);
            next(HttpStatusCode.转换出错);
            return;
        }
        if (html != undefined) res.send(html);
        Thread.terminate(worker);
        next();
    }
);

export default router;
