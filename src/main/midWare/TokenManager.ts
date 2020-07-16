import User from "@/model/User";
import { v4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "@/utils/constants";

class TokenManager {
    static limitedTime = 2;

    tokens = new Map<string, User>();

    /**
     * add res.locals.currentUser
     */
    validate() {
        return (req: Request, res: Response, next: NextFunction) => {
            let token = req.headers["token"] as string | undefined;
            if (token == undefined || !this.tokens.has(token))
                next(HttpStatusCode.token过期);
            else if (this.isTimeout(token)) {
                this.tokens.delete(token);
                next(HttpStatusCode.token过期);
            } else {
                res.locals.currentUser = this.tokens.get(token);
                next();
            }
        };
    }

    protected isTimeout(token: string) {
        return (
            parseInt(token.substring(0, token.indexOf("t"))) <
            new Date().getTime() - TokenManager.limitedTime * 60 * 60 * 1000
        );
    }

    /**
     * need res.locals.user
     */
    generateToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            let token = new Date().getTime() + "t" + v4();
            this.tokens.set(token, res.locals.user);
            res.send({ token });
            next();
        };
    }
}

export default new TokenManager();
