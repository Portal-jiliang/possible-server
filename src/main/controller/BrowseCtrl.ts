import express from "express";
import TokenManager from "@/midWare/TokenManager";

let router = express.Router();

router.post("/home", TokenManager.validate(), (req, res) => {
    // TODO res.send("dkwnadnwkad");
});

export default router;