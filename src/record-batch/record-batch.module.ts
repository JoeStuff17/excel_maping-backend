import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RecordBatchEntity } from './entity/record-batch.entity';
import { RecordBatchController } from './record-batch.controller';
import { RecordBatchService } from './record-batch.service';

@Module({
  imports:[TypeOrmModule.forFeature([RecordBatchEntity]),],
  controllers: [RecordBatchController],
  providers: [RecordBatchService]
})
export class RecordBatchModule {}
