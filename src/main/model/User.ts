import UserRepo from "@/repo/UserRepo";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import Logger from "@/utils/Logger";

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
        let person = await UserRepo.getRepo().findOne(this);
        if (person != undefined) Object.assign(this, person);
        return person != undefined;
    }

    async register() {
        return await UserRepo.add(this);
    }
}
