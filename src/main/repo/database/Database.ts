import logger from "@/utils/Logger";
import { Connection, createConnection } from "typeorm";

export default class Database {
    static connection: Connection;

    static createConnection() {
        if (this.connection) return;
        logger.log("开始连接数据库");
        createConnection()
            .then(connection => {
                this.connection = connection;
                logger.log("数据库连接成功");
            })
            .catch(e => logger.error("数据库连接失败:" + e));
    }
}
