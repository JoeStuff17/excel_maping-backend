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
    Id: string;

    @Column({ nullable: true })
    Name: string;

    @Column({ nullable: true })
    Age: string;

    @Column({ nullable: true })
    Gender: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}