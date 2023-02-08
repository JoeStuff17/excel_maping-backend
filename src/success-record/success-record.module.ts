import { FailedRecordModule } from './../failed-record/failed-record.module';
import { FailedRecordService } from './../failed-record/failed-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SuccessRecordEntity } from './entity/success-record.entity';
import { SuccessRecordController } from './success-record.controller';
import { SuccessRecordService } from './success-record.service';

@Module({
    imports: [TypeOrmModule.forFeature([SuccessRecordEntity])],
    controllers: [SuccessRecordController],
    providers: [SuccessRecordService,FailedRecordService],
    exports:[SuccessRecordService]
})
export class SuccessRecordModule { }

