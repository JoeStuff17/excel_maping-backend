import { Injectable,  Logger } from '@nestjs/common';
require('dotenv').config();
import * as fs from 'fs';
import { S3 } from 'aws-sdk';


@Injectable()
export class FileService {
  constructor(
  ) { }

  logger: Logger = new Logger(FileService.name);

  async upload(file: any, folder: string, bucket: string) {
    const { filename, mimetype } = file;
    await this.uploadS3(
      fs.createReadStream(file.path),
      bucket,
      filename,
      mimetype,
      folder
    );
    fs.unlink(file.path, () => true);
  }

  async uploadFromLocal(
    file,
    folder: string,
    fileName: string,
    bucket: string,
    mimeType: string
  ) {
    await this.uploadS3(
      fs.createReadStream(file.path),
      bucket,
      fileName,
      mimeType,
      folder
    );
  }

  async uploadS3(
    file,
    bucket: string,
    name: string,
    type: string,
    folder: string
  ) {
    const s3 = this.getS3(bucket);
    const params = {
      Bucket: `${bucket}/${folder}`,
      Key: String(name),
      Body: fs.createReadStream(file.path),
      ContentType: type,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  // async download(data: { id: number }): Promise<any> {
  //   const file = await this.fileRepository.findOne({ id: data.id });
  //   const s3 = await this.getS3(file.bucketName);
  //   const getParams = {
  //     Bucket: file.bucketName, // your bucket name,
  //     Key: `${file.path}/${file.displayName}`, // path to the object you're looking for
  //     // Expires: 30
  //   };

  //   const response = await s3.getObject(getParams).promise();
  //   // const response = await s3.getSignedUrl('getObject', getParams);
  //   const objectData = await response.Body.toString('base64'); // Use the encoding necessary

  //   return {
  //     success: true,
  //     // data: response,
  //     data: objectData,
  //     message: 'Object fetched successfully!',
  //   };
  // }

  // async getLink(data: { id: number }): Promise<any> {
  //   const file = await this.fileRepository.findOne({ id: data.id });
  //   if (file) {
  //     const s3 = await this.getS3(file.bucketName);
  //     const getParams = {
  //       Bucket: file.bucketName, // your bucket name,
  //       Key: `${file.path}/${file.displayName}`, // path to the object you're looking for
  //       Expires: 300
  //     };
  //     const response = s3.getSignedUrl('getObject', getParams);
  //     return {
  //       success: true,
  //       data: response,
  //       message: 'Object fetched successfully!',
  //     };
  //   }
  //   return {
  //     success: true,
  //     data: '',
  //     message: 'Object fetched successfully!',
  //   };
  // }

  // async getLinkForClient(data: { id: number }): Promise<any> {
  //   const file = await this.fileRepository.findOne({ id: data.id });
  //   if (file) {
  //     const s3 = await this.getS3(file.bucketName);
  //     const getParams = {
  //       Bucket: file.bucketName, // your bucket name,
  //       Key: `${file.path}/${file.displayName}`, // path to the object you're looking for
  //       Expires: 3600
  //     };
  //     const response = s3.getSignedUrl('getObject', getParams);
  //     return {
  //       success: true,
  //       data: response,
  //       message: 'Object fetched successfully!',
  //     };
  //   }
  //   return {
  //     success: true,
  //     data: '',
  //     message: 'Object fetched successfully!',
  //   };
  // }

  getS3(bucket: string) {
    return new S3({
      // apiVersion: process.env.API_VERSION,
      params: {
        Bucket: bucket,
        acl: "public-read",
      },
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
    });
  }
}
