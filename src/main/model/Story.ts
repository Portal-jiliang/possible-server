import StoryRepo from "@/repo/StoryRepo";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";
import { Worker, spawn, Thread } from "threads";
import { Transpiler } from "@/utils/Transpiler";
import Logger from "@/utils/Logger";

@Entity()
export default class Story {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "author" })
    author: User;

    @Column()
    pageSrc?: string;

    @Column()
    viewURL?: string;

    pages?: [];

    constructor($title: string, $author: User) {
        this.title = $title;
        this.author = $author;
    }

    async compileAndSave() {
        await StoryRepo.getRepo().save(this);
        spawn<Transpiler>(new Worker("../utils/Transpiler"))
            .then(async worker => {
                await worker.transpile(this);
                await Thread.terminate(worker);
            })
            .catch(e => {
                Logger.logError("转换出错:" + e);
            });
    }
}
