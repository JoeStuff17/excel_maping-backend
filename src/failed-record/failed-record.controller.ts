import { FailedRecordService } from './failed-record.service';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';

@Controller('failed-record')
export class FailedRecordController {
    constructor(private failedRecordService: FailedRecordService){}
    
    @Get('/fail-records')
    async getRec(@Res() res): Promise<any> {
      const c = await this.failedRecordService.getRecords();
      return res.status(HttpStatus.OK).json({
        success: c.success,
        message: c.message,
        data: c.data,
      })
    }
}
