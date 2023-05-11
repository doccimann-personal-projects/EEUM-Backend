import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3FilesService {
  private readonly s3: AWS.S3 = new AWS.S3();
  private readonly bucketName: string = process.env.BUCKET_NAME;

  // 1개의 파일만을 업로드하는 메소드
  async uploadFile(
    folderPath: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileExtension = extname(file.originalname);
    const safeFileName = v4() + fileExtension;

    const fileKey = folderPath + '/' + safeFileName;

    // 파일 업로드
    await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
      })
      .promise();

    // s3에 업로드 된 파일 url을 가져온다
    const fileUrl: string = this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return fileUrl;
  }
}
