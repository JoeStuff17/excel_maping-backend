import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { RecordBatchService } from './record-batch.service';

@Controller('batch')
export class RecordBatchController {
    constructor(private recordBatchService: RecordBatchService){}

    @Get('/count')
    async rowCount(@Res() res): Promise<any> {
      const c = await this.recordBatchService.rowCount();
      return res.status(HttpStatus.OK).json({
        success: c.success,
        message: c.message,
        data: c.data,
      })
    }

    
}