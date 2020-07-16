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
import Page from "./Page";

@Entity()
export default class Story {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @Column()
    cover: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "author" })
    author: User;

    @Column()
    src?: string;

    @Column()
    viewURL?: string;

    pages: Page[];

    constructor(title: string, cover: string, author: User, pages: Page[]) {
        this.title = title;
        this.cover = cover;
        this.author = author;
        this.pages = pages;
    }

    async compileAndSave() {
        let novel = await StoryRepo.getRepo().save(this);
        Object.assign(this, novel);
        spawn<Transpiler>(new Worker("../utils/Transpiler"))
            .then(async worker => {
                let story = await worker.transpile(this);
                await Thread.terminate(worker);
                StoryRepo.getRepo().save(story);
            })
            .catch(e => {
                Logger.error("转换出错:" + e);
            });
    }
}
