import { FailedRecordEntity } from './entity/failed-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FailedRecordService {
  constructor(
    @InjectRepository(FailedRecordEntity) private failRecRepo: Repository<FailedRecordEntity>
  ) { }

  async createFailRec(payload): Promise<any> {
    const faildata = await this.failRecRepo.create(payload);
    const fd = await this.failRecRepo.save(faildata);
    return {
      success: true,
      message: 'Null_data Uploaded in failed_Rec successfully',
      data: fd
      // err: 
    }
  }

  async getRecords() {
    const r = await this.failRecRepo.find(
      { relations: ['batch'] }
    );
    return {
      success: true,
      message: 'Failed-Records Fetched Successfully!',
      data: r,
    };
  }

  async getRecordsByID(payload: { batch: any }) {
    const record = await this.failRecRepo.createQueryBuilder('failed').where('failed.batchId=:batchid', { batchid: payload.batch }).leftJoinAndSelect('failed.batch', 'batch').getMany();
    return {
      success: true,
      message: 'Failed-Records Fetched Successfully!',
      data: record,
    };
  }
}
