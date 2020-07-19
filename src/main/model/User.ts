import UserRepo from "@/repo/UserRepo";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    account: string;

    @Column({ select: false })
    password: string;

    constructor(account: string, password: string) {
        super();
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
