import Ctg from "@/model/Ctg";
import Story from "@/model/Story";
import CtgRepo from "@/repo/CtgRepo";
import StoryRepo from "@/repo/StoryRepo";
import express from "express";
import ReqLimiter from "@/midWare/ReqLimiter";
import Logger from "@/utils/Logger";
import { HttpStatusCode } from "@/utils/constants";

const hotAmount = 5;

let router = express.Router();

router.post("/hot", async (req, res) => {
    res.send({
        novel: await StoryRepo.sort("rating", "DESC")
            .select(["id", "title", "summary", "cover"])
            .take(hotAmount)
            .getRawMany(),
    });
});

router.post("/ctgHot", async (req, res) => {
    let ctgArray: (Ctg & {
        story?: Story[];
    })[] = await CtgRepo.getRepo().find();
    let sql = "";
    let sqlTemplate = StoryRepo.sort("rating", "DESC")
        .select(["id", "title", "summary", "cover", "ctg"])
        .where("story.ctg = :id")
        .take(hotAmount)
        .getQuery();
    let map = new Map<any, Story[]>();
    for (const ctg of ctgArray) {
        ctg.story = [];
        map.set(ctg.id, ctg.story);
        sql += `(${sqlTemplate.replace(":id", ctg.id!.toString())}) UNION `;
    }
    sql = sql.substring(0, sql.length - 6);
    let result: Story[] = await StoryRepo.getRepo().query(sql);
    result.forEach(story => {
        map.get(story.ctg)?.push(story);
    });
    res.send({ ctg: ctgArray });
});

router.post(
    "/ctg",
    ReqLimiter.limit(["ctg", "from", "number"]),
    async (req, res) => {
        let result = await StoryRepo.getRepo()
            .createQueryBuilder()
            .select(["id", "title", "summary", "cover"])
            .where("story.ctg = :ctg", {
                ctg: req.body.ctg,
            })
            .take(req.body.number)
            .skip(req.body.from)
            .getRawMany();
        res.send({ story: result });
    }
);

router.post("/detail", ReqLimiter.limit(["id"]), async (req, res, next) => {
    let result = await StoryRepo.getRepo().findByIds([req.body.id], {
        relations: ["author", "ctg"],
    });
    if (result.length == 0) {
        next(HttpStatusCode.实体不存在);
        return;
    } else res.send(result[0]);
});

export default router;
