import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileEntity } from './entity/file.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([FileEntity])
    ],
    controllers: [FileController],
    providers: [FileService],
  })
  export class FileModule {}
  
