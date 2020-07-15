import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@/utils/constants";

class ReqLimiter {
    limit(names: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            let reqBody = req.method == "GET" ? req.query : req.body;
            for (const name of names) {
                if (reqBody[name] == undefined) {
                    next(HttpStatusCode.参数不足);
                    return;
                }
            }
            next();
        };
    }
}

export default new ReqLimiter();
