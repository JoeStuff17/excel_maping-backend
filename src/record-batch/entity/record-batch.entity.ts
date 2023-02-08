import { FailedRecordEntity } from './../../failed-record/entity/failed-record.entity';
import { SuccessRecordEntity } from './../../success-record/entity/success-record.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'batch'})
export class RecordBatchEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    batchId: number;

    @Column()
    Client_Id: number;

    @Column()
    totalCount: number;

    @Column()
    successCount: number;

    @Column()
    failedCount: number;

    @OneToMany(() => SuccessRecordEntity, (successRecord: SuccessRecordEntity) => successRecord.batch)
    successRecord : SuccessRecordEntity[];

    @OneToMany(() => FailedRecordEntity, (failRecord: FailedRecordEntity) => failRecord.batch)
    failRecord : FailedRecordEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}