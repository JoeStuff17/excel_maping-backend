import { FileEntity } from './entity/file.entity';
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
//  import ff from 'fs';

var xml = require('fs');
// let a = 0;


@Injectable()
export class FileService {
    constructor(@InjectRepository(FileEntity)
    private fileRepo: Repository<FileEntity>
    ) { }

    // Excel = require('exceljs');

    async creates(payload): Promise<any> {

        const arr = [];
        let s = 0;
        for (let i = 0; i < payload.id.length; i++) {
            //console.log(payload.name[i])
            if (payload.id[i] == null || payload.name[i] == null || payload.age[i] === null || payload.sex[i] == null) 
            {
                arr.push({Id:payload.id[i], Name:payload.name[i], Age:payload.age[i], Sex:payload.sex[i]}, );
            }
         else{
            const data = await this.fileRepo.create({ id: payload.id[i], name: payload.name[i], age: payload.age[i], sex: payload.sex[i] });
            const f = await this.fileRepo.save(data);
            s++;
         }
        }
        let cs = await xml.createWriteStream('./xml/sample.txt');
        let a =0;
        for (let i = 0; i < arr.length; i++) {                      
                cs.write("Id:"+arr[i].Id+"\t\t"),
                cs.write("Name:"+arr[i].Name+"\t\t"),
                cs.write("Age:"+arr[i].Age+"\t"),
                cs.write("Sex:"+arr[i].Sex+"\n")
                a++;
        }
        await cs.end();
        return {
            success: true,
            message: "Null_data Uploaded in txt_file successfully",
            data: s,
            err : a
        }
    }

    async readsheet(): Promise<any> {
        const a = await this.fileRepo.query("SELECT *  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'file';")
        const ff = [];

        for (let i = 0; i < a.length; i++) {
            if (a[i].COLUMN_NAME == 'Gid' || a[i].COLUMN_NAME == 'createdAt' || a[i].COLUMN_NAME == 'updateAt') { }
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

    async countRow(){
        const c = await this.fileRepo.count();
        return {
            success: true,
            message: 'File-count Fetched Successfully!',
            data: c,
        };
    }
}
