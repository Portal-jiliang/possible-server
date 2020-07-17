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
import FileStorage from "@/utils/FileStorage";

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

    /**
     * add id
     */
    async save() {
        let novel = await StoryRepo.getRepo().save(this);
        Object.assign(this, novel);
    }

    /**
     * @param  {boolean} isPreview need id when false
     */
    async compile(isPreview: boolean = false) {
        try {
            let worker = await spawn<Transpiler>(
                new Worker("../utils/Transpiler")
            );
            let story = await worker.transpile(this, isPreview);
            await Thread.terminate(worker);
            if (isPreview)
                setTimeout(() => {
                    if (story.viewURL)
                        FileStorage.deleteFolder(
                            story.viewURL?.substring(
                                0,
                                story.viewURL.lastIndexOf("/")
                            )
                        );
                }, 1000 * 60 * 30);
            else StoryRepo.getRepo().save(story);
            return story.viewURL;
        } catch (e) {
            Logger.error("转换出错:" + e);
            return undefined;
        }
    }
}
