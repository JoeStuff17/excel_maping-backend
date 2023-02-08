import { FailedRecordEntity } from './entity/failed-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FailedRecordService } from './failed-record.service';
import { FailedRecordController } from './failed-record.controller';
import { Module } from '@nestjs/common';

@Module({
    imports:[TypeOrmModule.forFeature([FailedRecordEntity]) ],
    controllers:[FailedRecordController],
    providers:[FailedRecordService],
    exports:[FailedRecordService]
})
export class FailedRecordModule {}
