import ReqLimiter from "@/midWare/ReqLimiter";
import TokenManager from "@/midWare/TokenManager";
import Story from "@/model/Story";
import User from "@/model/User";
import express from "express";

let router = express.Router();

router.post(
    "/upload",
    TokenManager.validate(),
    ReqLimiter.limit(["title", "pages", "cover"]),
    ReqLimiter.initEntity(Story),
    async (req, res, next) => {
        let story: Story = res.locals.story;
        story.author = res.locals.currentUser as User;
        await story.compileAndSave();
        res.sendStatus(200);
        next();
    }
);

export default router;
