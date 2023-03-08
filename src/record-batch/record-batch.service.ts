import { RecordBatchEntity } from './entity/record-batch.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecordBatchService {
	constructor(
		@InjectRepository(RecordBatchEntity) private readonly batchRepository: Repository<RecordBatchEntity>,
	) { }

	async create(payload: any) {
		const createBatch = await this.batchRepository.create(payload);
		return await this.batchRepository.save(createBatch);
	}

	async update(payload: {id: number, data: any}) {
		return await this.batchRepository.update({id: payload.id}, payload.data)
	}

	async rowCount() {
    const c = await this.batchRepository.find()
    return {
      success: true,
      message: 'File-count Fetched Successfully!',
      data: c,
    };
  }

	async fetch() {
    const c = await this.batchRepository.find()
    return {
      success: true,
      message: 'File-count Fetched Successfully!',
      data: c,
    };
  }

  async fetchOne(id: number) {
    return this.batchRepository.findOne({where: {id}});
  }
}
