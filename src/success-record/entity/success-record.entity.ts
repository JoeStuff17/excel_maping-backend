import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { RecordBatchEntity } from '../../record-batch/entity/record-batch.entity';

export enum status{
    uploaded = "UPLOADED",
    processing = "PROCESSING",
    created = "CREATED"
}

@Entity({ name: 'success_record' })
export class SuccessRecordEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    Client_Id: string;

    @Column({ nullable: true })
    Customer_Name: string;

    @Column({ nullable: true })
    Customer_MobileNo: number;

    @Column({ nullable: true })
    Vehicle_Brand: string;

    @Column({ nullable: true })
    Vehicle_Model: string;

    @Column({ nullable: true })
    Vehicle_Register_No: string;

    @Column({ nullable: true })
    Seller_Id: number;

    @Column({ nullable: true })
    lat: string;

    @Column({ nullable: true })
    lng: string;

    @Column({ nullable: true })
    Plan_Id: string;

    @Column({ nullable: true })
    Plan_Purchased_Date: string;

    @ManyToOne(() => RecordBatchEntity, (batch: RecordBatchEntity) => batch.successRecord)
    @JoinColumn()
    batch: RecordBatchEntity;

    @Column({default: status.processing})
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}