import { FailedRecordService } from './../failed-record/failed-record.service';
import { FailedRecordEntity } from './../failed-record/entity/failed-record.entity';
import { SuccessRecordEntity } from './entity/success-record.entity';
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordBatchService } from 'src/record-batch/record-batch.service';

var xml = require('fs');

@Injectable()
export class SuccessRecordService {
  constructor(
    @InjectRepository(SuccessRecordEntity) private readonly succcessRepo: Repository<SuccessRecordEntity>,
    private readonly failedRecordService: FailedRecordService,
    private readonly batchService: RecordBatchService
  ) { }

  async creates(payload) {
    let s = 0;
    const fc = [];
    let sc = 0;
    let clientIds: any;
    const batch: any = await this.batchService.create({
      totalCount: payload.length,
      // successCount: su,
      // failedCount: arr.length
    });

    // clientIds = payload.Client_Id[0];
    clientIds = 1;

    for (let i = 0; i < payload.Customer_Name.length; i++) {
      // payload.batch = batch.id;
      
      if (payload.Customer_Name[i] == null ||
        !payload.Customer_MobileNo[i] == null || !payload.Plan_Id[i] == null) {
        fc.push({
          Client_Id: clientIds, Customer_Name: payload.Customer_Name[i], Customer_MobileNo:
            payload.Customer_MobileNo[i], Plan_Id: payload.Plan_Id[i], batch: batch.id
        });
        await this.failedRecordService.createFailRec(fc);
        // console.log(arr.length);

      } else {
        // payload.batch = Array(payload.Client_Id.length).fill(batch.id);
        const successdata = await this.succcessRepo.create({
          Client_Id: clientIds,
          Customer_Name: payload.Customer_Name[i],
          Customer_MobileNo: payload.Customer_MobileNo[i],
          Plan_Id: payload.Plan_Id[i],
          batch: batch.id
        });
        const sd = await this.succcessRepo.save(successdata);
        sc += 1;
      }

      //<--------- Failed Entry in .txt file -------->
      // let cs = await xml.createWriteStream('./xml/sample.txt');
      // let a = 0;
      // for (let i = 0; i < arr.length; i++) {
      //     cs.write("Id:" + arr[i].Client_Id + "\t\t"),
      //         cs.write("Name:" + arr[i].Client_Name + "\t\t"),
      //         cs.write("Mobile:" + arr[i].Mobile_No + "\t"),
      //         cs.write("PlanId:" + arr[i].Plan_ID + "\n")
      //     a++;
      // }
      // await cs.end();
      // return {
      //     success: true,
      //     message: "Null_data Uploaded in txt_file successfully",
      //     data: s,
      //     err: a
      // }

    }
    await this.batchService.update({
      id: batch.id, data: {
        Client_Id: clientIds,
        totalCount: payload.Customer_Name.length,
        successCount: sc,
        failedCount: fc.length
      }
    });
    return {
      success: true,
      message: "success",
      data: sc,
      err: fc.length
    }
  }

  async create(payload: any) {
    if (payload.length > 0) {
      // Create batch
      const batch: any = await this.batchService.create({
        successCount: payload.length,
        totalCount: payload.length
      });
      const clientIds = [];
      for (const p of payload) {
        p.batch = batch.id;
        clientIds.push(p.Client_Id);
        await this.batchService.update({ id: batch.id, data: { Client_Id: clientIds } });
        const createdData = await this.succcessRepo.create(p);
        const saveData: any = await this.succcessRepo.save(createdData);
      }
      return {
        success: true, message: 'Created successfully',
        data: {}
      }
    } else {
      return {
        success: false, message: '',
        data: {}
      }
    }
  }

  async readsheet(): Promise<any> {
    const a = await this.succcessRepo.query("SELECT *  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'success_record';")
    const ff = [];
    // a[i].COLUMN_NAME == 'Client_Id' ||
    for (let i = 0; i < a.length; i++) {
      if (a[i].COLUMN_NAME == 'id' || a[i].COLUMN_NAME == 'Client_Id' || a[i].COLUMN_NAME == 'createdAt' ||
        a[i].COLUMN_NAME == 'updateAt' || a[i].COLUMN_NAME == 'batchId') { }
      else {
        ff.push(a[i].COLUMN_NAME);
      }
    }
    return {
      success: true,
      message: 'Profile Fetched Successfully!',
      data: ff,
      err: null,
    };

  }

  async countRow() {
    const c = await this.succcessRepo.count();
    return {
      success: true,
      message: 'File-count Fetched Successfully!',
      data: c,
    };
  }
}
