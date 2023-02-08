
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RecordBatchModule } from './record-batch/record-batch.module';
import { SuccessRecordModule } from './success-record/success-record.module';
import { FailedRecordModule } from './failed-record/failed-record.module';

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
    SuccessRecordModule,
    RecordBatchModule,
    FailedRecordModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
