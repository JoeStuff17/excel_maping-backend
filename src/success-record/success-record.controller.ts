import { diskStorage } from 'multer';
import { Body, Controller, Get, HttpStatus, ParseFilePipe, Post, Query, Req, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessRecordService } from './success-record.service';
import { Request } from 'express';

@Controller('success-record')
export class SuccessRecordController {
  constructor(private successRecordService: SuccessRecordService) { }


  ///----Adding data----///
  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Res() res, @Body() payload: { data: any[] }): Promise<any> {
    const file = await this.successRecordService.creates(payload);
    // const file = await this.fileService.create(payload);

    return res.status(HttpStatus.OK).json({
      success: file.success,
      message: file.message,
      data: file.data,
      err: file.err
    })
  }

  ///----Uploading Excel file wid custom name----///
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join('_') + '_' + Date.now() + '.' + fileExtension;
        cb(null, newFileName);
      }
    }),
  }))
  async uploadFile(@Res() res, @UploadedFile() file: any): Promise<any> {    
    const uploadFile = await this.successRecordService.fileUpload(file);
    return res.status(HttpStatus.OK).json({
      success: true,
      file: uploadFile
    });
  }

// uploadFile(
  //   @UploadedFile(new ParseFilePipe({
  //     validators: [
  //       // new MaxFileSizeValidator({ maxSize: 2000 }),
  //       // new FileTypeValidator({ fileType: 'xlsx' }),
  //     ],
  //   }),
  //   ) file: Express.Multer.File) {
  //   return {
  //     imagePath: file.path,
  //     success: true,
  //     message: "File Upladed Successfully"
  //   };
  // }


  ///----Fetching table headers----///
  @Get('/fetch')
  async tableHeaders(@Res() res): Promise<any> {
    const head = await this.successRecordService.readsheet();
    return res.status(HttpStatus.OK).json({
      success: head.success,
      message: head.message,
      data: head.data,
      error: head.err
    })
  }

  @Get('/tot-count')
  async rowCount(@Res() res): Promise<any> {
    const c = await this.successRecordService.countRow();
    return res.status(HttpStatus.OK).json({
      success: c.success,
      message: c.message,
      data: c.data,
    })
  }

  @Get('/suc-records')
  async getRec(@Res() res): Promise<any> {
    const c = await this.successRecordService.getRecords();
    return res.status(HttpStatus.OK).json({
      success: c.success,
      message: c.message,
      data: c.data,
    })
  }

  // @Get('/findById')
  // async getMakes(@Res() res,@Req() payload:Request): Promise<any> {
  //   const id = await this.successRecordService.getMakes(payload);
  //   return res.status(HttpStatus.OK).json({
  //     success: id.success,
  //     message: id.message,
  //     data: id.data,
  //   })
  // }

}
