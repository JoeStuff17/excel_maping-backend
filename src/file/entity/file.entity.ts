import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@Entity({ name: 'file' })
export class FileEntity {
    @PrimaryGeneratedColumn()
    Gid: number;

    @Column({ nullable: true })
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    age: string;

    @Column({ nullable: true })
    sex: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}