import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from "@nestjs/axios";
import { Module } from '@nestjs/common';
import { RecordBatchModule } from './record-batch/record-batch.module';
import { SuccessRecordModule } from './success-record/success-record.module';
import { FailedRecordModule } from './failed-record/failed-record.module';
import { ApiService } from './api/api.service';
import { WrapperController } from './wrapper/wrapper.controller';
import { WrapperService } from './wrapper/wrapper.service';
import { WrapperModule } from './wrapper/wrapper.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        port: 3306,
        host: process.env.DB_IP,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    HttpModule,
    SuccessRecordModule,
    RecordBatchModule,
    FailedRecordModule,
    WrapperModule
  ],
  controllers: [WrapperController],
  providers: [ApiService, WrapperService],
})
export class AppModule { }
