import { RecordBatchEntity } from '../../record-batch/entity/record-batch.entity';
import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne
} from "typeorm";

@Entity({ name: 'failed_record' })
export class FailedRecordEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    Client_Id: string;

    @Column({ nullable: true })
    Customer_Name: string;

    @Column({ nullable: true })
    Customer_MobileNo: string;

    @Column({ nullable: true })
    Plan_Id: string;

    @ManyToOne(() => RecordBatchEntity, (batch: RecordBatchEntity) => batch.failRecord)
    @JoinColumn()
    batch: RecordBatchEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}