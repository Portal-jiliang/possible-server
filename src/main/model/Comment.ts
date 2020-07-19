import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Story from "./Story";
import User from "./User";

@Entity()
export default class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "user" })
    user: User;

    @OneToOne(() => Story)
    @JoinColumn({ name: "story" })
    story: Story;

    @Column()
    comment: string;

    @Column()
    rating: number;

    constructor($user: User, $story: Story, $comment: string, $rate: number) {
        super();
        this.user = $user;
        this.story = $story;
        this.comment = $comment;
        this.rating = $rate;
    }
}
