import {
    Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { RecordBatchEntity } from '../../record-batch/entity/record-batch.entity';

export enum STATUS{
    UPLOADED = "UPLOADED",
    PROCESSING = "PROCESSING",
    CREATED = "SUBSCRIPTION CREATED",
    EMPTY = "FIELD EMPTY"
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
    Customer_MobileNo: string;

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
    Plan_Purchased_Date: Date;

    @ManyToOne(() => RecordBatchEntity, (batch: RecordBatchEntity) => batch.successRecord)
    @JoinColumn()
    batch: RecordBatchEntity;

    @Column({default: STATUS.PROCESSING})
    status: string;

    @Column({ nullable: true })
    Subscription_Id: number;

    @Column({default: null})
    processed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}