import StoryRepo from "@/repo/StoryRepo";
import FileStorage from "@/utils/FileStorage";
import Logger from "@/utils/Logger";
import { Transpiler } from "@/utils/Transpiler";
import { spawn, Thread, Worker } from "threads";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Ctg from "./Ctg";
import Page from "./Page";
import User from "./User";

@Entity()
export default class Story extends BaseEntity {
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

    @Column()
    rating?: number;

    @Column()
    summary?: string;

    @OneToOne(() => Ctg)
    @JoinColumn({ name: "ctg" })
    ctg?: Ctg;

    pages: Page[];

    constructor(title: string, cover: string, author: User, pages: Page[]) {
        super();
        this.title = title;
        this.cover = cover;
        this.author = author;
        this.pages = pages;
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
