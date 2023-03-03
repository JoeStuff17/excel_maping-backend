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
import { STATUS } from 'src/success-record/entity/success-record.entity';


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

    @ManyToOne(() => RecordBatchEntity, (batch: RecordBatchEntity) => batch.failRecord)
    @JoinColumn()
    batch: RecordBatchEntity;

    @Column({default: null})
    processed: boolean;

    @Column({default: STATUS.PROCESSING})
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}