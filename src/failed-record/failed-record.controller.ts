import { FailedRecordService } from './failed-record.service';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';

@Controller('failed-record')
export class FailedRecordController {
  constructor(private failedRecordService: FailedRecordService) { }

  @Get('/fail-records')
  async getRec(@Res() res): Promise<any> {
    const count = await this.failedRecordService.getRecords();
    return res.status(HttpStatus.OK).json({
      success: count.success,
      message: count.message,
      data: count.data
    })
  }

  @Get('/findById')
  async getRecords(@Res() res, @Query() payload: { batch: number }) {
    const id = await this.failedRecordService.getRecordsByID(payload);
    return res.status(HttpStatus.OK).json({
      success: id.success,
      message: id.message,
      data: id.data
    });
  }
}
