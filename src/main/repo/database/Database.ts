import logger from "@/utils/Logger";
import { createConnection } from "typeorm";

export default class Database {
    static isConnecting: boolean = false;

    static createConnection() {
        if (Database.isConnecting) return;
        logger.log("开始连接数据库");
        Database.isConnecting = true;
        createConnection()
            .then(() => {
                logger.log("数据库连接成功");
            })
            .catch(e => logger.error("数据库连接失败:" + e));
    }
}
