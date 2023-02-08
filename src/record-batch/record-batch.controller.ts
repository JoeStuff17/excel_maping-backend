import { Controller } from '@nestjs/common';
import { RecordBatchService } from './record-batch.service';

@Controller('batch')
export class RecordBatchController {
    constructor(private recordBatchService: RecordBatchService){}
}