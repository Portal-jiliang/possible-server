import ReqLimiter from "@/midWare/ReqLimiter";
import TokenManager from "@/midWare/TokenManager";
import Story from "@/model/Story";
import User from "@/model/User";
import { Transpiler } from "@/utils/Transpiler";
import express from "express";
import { Thread, Worker, spawn } from "threads";
import { HttpStatusCode } from "@/utils/constants";
import Logger from "@/utils/Logger";
import StoryRepo from "@/repo/StoryRepo";

let router = express.Router();

router.post(
    "/upload",
    TokenManager.validate(),
    ReqLimiter.limit(["title", "pages", "cover"]),
    ReqLimiter.initEntity(Story),
    async (req, res, next) => {
        let story: Story = res.locals.story;
        story.author = res.locals.currentUser as User;
        let isSuccessful = false;
        if (story.id != undefined) {
            let condition: { author: any; id?: number } = {
                author: res.locals.currentUser.id,
            };
            condition.id = story.id;
            let updateColumn = Object.assign({}, story);
            delete updateColumn.pages;
            delete updateColumn.viewURL;
            delete updateColumn.src;
            const result = await StoryRepo.getRepo().update(
                condition,
                updateColumn
            );
            if (result.affected && result.affected > 0) isSuccessful = true;
            else {
                next(HttpStatusCode.权限错误);
                return;
            }
        } else {
            await StoryRepo.add(story);
            isSuccessful = true;
        }
        if (isSuccessful) story.compile();
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

router.post(
    "/edit",
    TokenManager.validate(),
    ReqLimiter.limit(["story"]),
    async (req, res, next) => {
        let story = await StoryRepo.getRepo().findOne(req.body.story, {
            where: { author: res.locals.currentUser },
        });
        if (story == undefined) next(HttpStatusCode.权限错误);
        else {
            let src = story.readScr();
            if (src != undefined) {
                story.pages = JSON.parse(src);
                res.send(story);
            } else next(HttpStatusCode.转换出错);
        }
    }
);

export default router;
