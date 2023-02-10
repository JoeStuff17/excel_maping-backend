import { FailedRecordEntity } from './../../failed-record/entity/failed-record.entity';
import { SuccessRecordEntity } from './../../success-record/entity/success-record.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'batch'})
export class RecordBatchEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, type: 'simple-array'})
    Client_Id: number[];

    @Column({nullable: true})
    totalCount: number;

    @Column({nullable: true})
    successCount: number;

    @Column({nullable: true})
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