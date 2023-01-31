import { FileDto } from './dto/file.dto';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) { }


  ///----Adding data----///
  @Post('/create')
  @UsePipes(ValidationPipe)
  async fetch(@Res() res, @Body() payload:{data}): Promise<any> {
    const file = await this.fileService.creates(payload);
    return res.status(HttpStatus.OK).json({
      success: file.success,
      message: file.message
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
  uploadFile(
    @UploadedFile(new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 2000 }),
        // new FileTypeValidator({ fileType: 'xlsx' }),
      ],
    }),
    ) file: Express.Multer.File) {
    return {
      imagePath: file.path,
      success: true,
      message: "File Upladed Successfully"
    };
  }

  ///----Fetching table headers----///
  @Get('/fetch')
  async tableHeaders(@Res() res): Promise<any> {
    const head = await this.fileService.readsheet();
    return res.status(HttpStatus.OK).json({
      success: head.success,
      message: head.message,
      data: head.data,
      error: head.err
    })
  }

  @Get('/count')
  async rowCount(@Res() res): Promise<any>{
    const c = await this.fileService.countRow();
    return res.status(HttpStatus.OK).json({
      success: c.success,
      message: c.message,
      data: c.data,
      error: c.err
    })
  }
}
