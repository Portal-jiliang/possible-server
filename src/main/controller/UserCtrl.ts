import tokenManager from "@/midWare/TokenManager";
import User from "@/model/User";
import express from "express";
import { HttpStatusCode } from "@/utils/constants";
import ReqLimiter from "@/midWare/ReqLimiter";
import StoryRepo from "@/repo/StoryRepo";

let router = express.Router();

router.post(
    "/login",
    ReqLimiter.limit(["account", "password"]),
    ReqLimiter.initEntity(User),
    async (req, res, next) => {
        if (await (res.locals.user as User).login()) next();
        else next(HttpStatusCode.实体不存在);
    },
    tokenManager.generateToken()
);

router.post(
    "/register",
    ReqLimiter.limit(["account", "password"]),
    ReqLimiter.initEntity(User),
    async (req, res, next) => {
        if (await (res.locals.user as User).register()) next();
        else next(HttpStatusCode.要注册的用户已经存在);
    },
    tokenManager.generateToken()
);

router.post("/story", tokenManager.validate(), async (req, res, next) => {
    res.send(
        await StoryRepo.getRepo().find({
            select: ["id", "title", "cover", "summary"],
            where: { author: res.locals.currentUser },
        })
    );
    next();
});

export default router;
