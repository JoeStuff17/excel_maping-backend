import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from "@nestjs/axios";
import { Module } from '@nestjs/common';
import { RecordBatchModule } from './record-batch/record-batch.module';
import { SuccessRecordModule } from './success-record/success-record.module';
import { FailedRecordModule } from './failed-record/failed-record.module';
import { ApiService } from './api/api.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'excel_mapping',
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    HttpModule,
    SuccessRecordModule,
    RecordBatchModule,
    FailedRecordModule
  ],
  controllers: [],
  providers: [ApiService],
})
export class AppModule {}
