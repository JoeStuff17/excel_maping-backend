import { FailedRecordService } from './failed-record.service';
import { Controller } from '@nestjs/common';

@Controller('failed-record')
export class FailedRecordController {
    constructor(private failedRecordService: FailedRecordService){}
    
}
