import UserRepo from "@/repo/UserRepo";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    account: string;

    @Column()
    password: string;

    constructor(account: string, password: string) {
        this.account = account;
        this.password = password;
    }

    async login() {
        let person = await UserRepo.getRepo()
            .createQueryBuilder()
            .where(
                "user.account = :account and user.password = :password",
                this
            )
            .getOne();
        return person != undefined;
    }

    async register() {
        let person = await UserRepo.getRepo()
            .createQueryBuilder()
            .where("user.account = :account", this)
            .getOne();
        if (person == undefined) {
            await UserRepo.getRepo().save(this);
            return true;
        } else return false;
    }
}
