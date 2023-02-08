import { FailedRecordEntity } from './entity/failed-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FailedRecordService {
	constructor(
		// @InjectRepository(FailedRecordEntity) private failRecRepo: Repository<FailedRecordEntity>
	) { }

	// async createFailRec(payload): Promise<any> {
	// 	const faildata = await this.failRecRepo.create(payload);
	// 	const fd = await this.failRecRepo.save(faildata);
	// 	return {
	// 		success: true,
	// 		message: "Null_data Uploaded in failed_Rec successfully",
	// 		data: fd
	// 		// err: 
	// 	}
	// }
}
