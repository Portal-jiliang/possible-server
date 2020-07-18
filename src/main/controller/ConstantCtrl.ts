import express from "express";
import CtgRepo from "@/repo/CtgRepo";

let router = express.Router();

router.post("/ctg", async (req, res, next) => {
    res.send({ ctg: await CtgRepo.getRepo().find() });
    next();
});

export default router;
