import { FailedRecordService } from './../failed-record/failed-record.service';
import { FailedRecordEntity } from './../failed-record/entity/failed-record.entity';
import { SuccessRecordEntity } from './entity/success-record.entity';
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

var xml = require('fs');

@Injectable()
export class SuccessRecordService {
    constructor(
        @InjectRepository(SuccessRecordEntity) private readonly succcessRepo: Repository<SuccessRecordEntity>,
        private readonly failedRecordService: FailedRecordService
    ) { }

    // Excel = require('exceljs');

    async creates(payload) {
        let s = 0;
        const arr = [];
        console.log(payload.Client_Id.length);
        for (let i = 0; i < payload.Client_Id.length; i++) {
            // console.log(payload)
            if (payload.Client_Id[i] == null || payload.Client_Name[i] == null || payload.Mobile_No[i] == null || payload.Plan_Id[i] == null) {
                arr.push({ Client_Id: payload.Client_Id[i], Client_Name: payload.Client_Name[i], Mobile_No: payload.Mobile_No[i], Plan_Id: payload.Plan_Id[i] });
                // const faildata = await this.failedRecordService.createFailRec(payload);
                // return faildata;
            }
            else {
                const successdata = await this.succcessRepo.create({ Client_Id: payload.Client_Id[i], Client_Name: payload.Client_Name[i], Mobile_No: payload.Mobile_No[i], Plan_Id: payload.Plan_Id[i] });
                const sd = await this.succcessRepo.save(successdata);
                s++;
                return {
                    success: true,
                    message: "Data Uploaded in Success_Rec successfully",
                    data: sd
                    // err: 
                }
            }
        }

        //<--------- Failed Entry in .txt file -------->
        let cs = await xml.createWriteStream('./xml/sample.txt');
        let a = 0;
        for (let i = 0; i < arr.length; i++) {
            cs.write("Id:" + arr[i].Client_Id + "\t\t"),
                cs.write("Name:" + arr[i].Client_Name + "\t\t"),
                cs.write("Mobile:" + arr[i].Mobile_No + "\t"),
                cs.write("PlanId:" + arr[i].Plan_ID + "\n")
            a++;
        }
        await cs.end();
        return {
            success: true,
            message: "Null_data Uploaded in txt_file successfully",
            data: s,
            err: a
        }

    // payload.data.map(async (val: any) => {
        //     console.log(payload);
        //     if (val.Client_Id == null || val.Client_Name == null || val.Mobile_No === null || val.Plan_Id == null || val.batch == null) {
        //         arr.push({ Client_Id: val.Client_Id, Client_Name: val.Client_Name, Mobile_No: val.Mobile_No, Plan_Id: val.Plan_Id, batch: val.batch});
        //         // const faildata = await this.failedRecordService.createFailRec(payload);
        //         // return faildata;
        //         console.log("inside If");
                
        //     }
        //     else {
        //         console.log("Inside Else");
        //         const successdata = await this.succcessRepo.create({ Client_Id: val.Client_Id, Client_Name: val.Client_Name, Mobile_No: val.Mobile_No, Plan_Id: val.Plan_Id, batch: val.batch});
        //         const sd = await this.succcessRepo.save(successdata);
        //         s++;
        //         return {
        //             success: true,
        //             message: "Data Uploaded in Success_Rec successfully",
        //             data: sd,
        //             err: s
        //         }
        //     }
        // })
    }

    async create(payload: { data: any[] }) {
        if (payload.data.length > 0) {
            for (const p of payload.data) {
                const createdData = await this.succcessRepo.create(p);
                const saveData = await this.succcessRepo.save(createdData);
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

        for (let i = 0; i < a.length; i++) {
            if (a[i].COLUMN_NAME == 'id' || a[i].COLUMN_NAME == 'createdAt' || a[i].COLUMN_NAME == 'updateAt' || a[i].COLUMN_NAME == 'batchId') { }
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
