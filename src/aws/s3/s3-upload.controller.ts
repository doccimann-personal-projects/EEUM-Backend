import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { S3FilesService } from './s3-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileUploadRequest } from './profile-upload.request';
import { ProfileUploadResponse } from './profile-upload.response';

@ApiTags('이미지')
@UseFilters(HttpExceptionFilter)
@Controller('api/images')
export class S3UploadController {
  private readonly folderPath: string = 'user-profile';

  constructor(private readonly s3FilesService: S3FilesService) {}

  @ApiOperation({ summary: '유저 프로필 업로드 API 입니다.' })
  @ApiResponse({
    status: 200,
    description: '이미지 업로드 성공입니다',
    type: ProfileUploadResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ProfileUploadRequest })
  @Post('/user-profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<ProfileUploadResponse> {
    return file
      ? await this.s3FilesService.uploadFile(this.folderPath, file)
      : null;
  }
}
