import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { RecordBatchEntity } from '../../record-batch/entity/record-batch.entity';

@Entity({ name: 'success_record' })
export class SuccessRecordEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    Client_Id: string;

    @Column({ nullable: true })
    Client_Name: string;

    @Column({ nullable: true })
    Mobile_No: string;

    @Column({ nullable: true })
    Plan_Id: string;

    @ManyToOne(() => RecordBatchEntity, (batch: RecordBatchEntity) => batch.successRecord)
    @JoinColumn()
    batch: RecordBatchEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}