import { Brackets, getConnection, ObjectLiteral, Repository } from "typeorm";
import Database from "./database/Database";

export default abstract class Repo<T extends object> {
    protected repo?: Repository<T>;

    constructor() {
        Database.createConnection();
    }

    getRepoByEntity(entity: Function) {
        return this.repo ?? (this.repo = getConnection().getRepository(entity));
    }

    abstract getRepo(): Repository<T>;

    where(
        condition:
            | Brackets
            | string
            | ((qb: this) => string)
            | ObjectLiteral
            | ObjectLiteral[],
        parameters?: ObjectLiteral
    ) {
        return this.getRepo().createQueryBuilder().where(condition, parameters);
    }

    async add(entity: T) {
        let sql = this.getRepo()
            .createQueryBuilder()
            .insert()
            .into(entity.constructor)
            .values(entity);
        sql.getQueryAndParameters()[0].replace("INSERT", "INSERT IGNORE");
        try {
            await sql.execute();
            return true;
        } catch (e) {
            return false;
        }
    }
}
