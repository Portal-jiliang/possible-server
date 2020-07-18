import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Ctg {
    @PrimaryColumn()
    id?: number;

    @Column()
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
