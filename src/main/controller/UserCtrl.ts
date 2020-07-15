import tokenManager from "@/midWare/TokenManager";
import User from "@/model/User";
import express from "express";
import { HttpStatusCode } from "@/utils/constants";
import ReqLimiter from "@/midWare/ReqLimiter";

let router = express.Router();

router.post(
    "/login",
    ReqLimiter.limit(["account", "password"]),
    async (req, res, next) => {
        res.locals.user = new User(req.body.account, req.body.password);
        if (await res.locals.user.login()) next();
        else next(HttpStatusCode.用户不存在);
    },
    tokenManager.generateToken()
);

router.post(
    "/register",
    ReqLimiter.limit(["account", "password"]),
    async (req, res, next) => {
        res.locals.user = new User(req.body.account, req.body.password);
        if (await res.locals.user.register()) next();
        else next("要注册的用户已经存在");
    },
    tokenManager.generateToken()
);

export default router;
