import { RecordBatchModule } from './../record-batch/record-batch.module';
import { FailedRecordModule } from './../failed-record/failed-record.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SuccessRecordEntity } from './entity/success-record.entity';
import { SuccessRecordController } from './success-record.controller';
import { SuccessRecordService } from './success-record.service';

@Module({
    imports: [TypeOrmModule.forFeature([SuccessRecordEntity]), FailedRecordModule, RecordBatchModule],
    controllers: [SuccessRecordController],
    providers: [SuccessRecordService]
})
export class SuccessRecordModule { }

