import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { extname } from 'path';
import { ProfileUploadResponse } from './profile-upload.response';

@Injectable()
export class S3FilesService {
  private readonly s3: AWS.S3 = new AWS.S3();
  private readonly bucketName: string = process.env.BUCKET_NAME;

  // 1개의 파일만을 업로드하는 메소드
  async uploadFile(
    folderPath: string,
    file: Express.Multer.File,
  ): Promise<ProfileUploadResponse> {
    const fileExtension = extname(file.originalname);
    const safeFileName = v4() + fileExtension;

    const fileKey = `${folderPath}/${safeFileName}`;

    // 파일 업로드
    await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
      })
      .promise();

    const imageUrl = this.getImageUrl(fileKey);

    return new ProfileUploadResponse(imageUrl);
  }

  private getImageUrl(fileKey: string): string {
    return `https://${this.bucketName}.s3.ap-northeast-2.amazonaws.com/${fileKey}`;
  }
}
