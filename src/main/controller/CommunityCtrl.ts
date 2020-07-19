import express from "express";
import ReqLimiter from "@/midWare/ReqLimiter";
import Comment from "@/model/Comment";
import { HttpStatusCode } from "@/utils/constants";
import TokenManager from "@/midWare/TokenManager";
import CommentRepo from "@/repo/CommentRepo";
import StoryRepo from "@/repo/StoryRepo";
import Story from "@/model/Story";

let router = express.Router();

router.post(
    "/comment/post",
    TokenManager.validate(),
    ReqLimiter.limit(["story", "comment", "rating"]),
    ReqLimiter.initEntity(Comment),
    async (req, res, next) => {
        let comment: Comment = res.locals.comment;
        comment.user = res.locals.currentUser.id;
        await comment.save();
        // 更新评分
        StoryRepo.getRepo()
            .createQueryBuilder()
            .update(Story)
            .where(`story.id = '${comment.story}'`)
            .set({
                rating: () =>
                    "(" +
                    CommentRepo.getRepo()
                        .createQueryBuilder()
                        .select("AVG(comment.rating)")
                        .where(`comment.story = '${comment.story}'`)
                        .getSql() +
                    ")",
            })
            .execute();
        if (comment.id != undefined) res.send(200);
        else next(HttpStatusCode.服务器正忙);
    }
);

router.use(
    "/comment/view",
    ReqLimiter.limit(["story"]),
    async (req, res, next) => {
        res.send({
            comments: await CommentRepo.getRepo().find({
                where: { story: req.body.story },
                relations: ["user"],
            }),
        });
    }
);

export default router;
