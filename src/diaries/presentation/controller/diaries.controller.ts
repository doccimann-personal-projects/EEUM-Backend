import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DiariesService } from '../../application/service/diaries.service';
import { CreateDiaryDto } from '../../application/dto/request/create-diary.request';
import { UpdateDiaryDto } from '../../application/dto/request/update-diary.request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDiaryResponse } from '../../application/dto/response/create-diary.response';
import { SingleSuccessResult } from '../../../common/response/success-response.format';
import { FailureResult } from '../../../common/response/failure-response.format';

@Controller('api/diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @ApiOperation({
    summary: '일기를 작성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일기 작성 성공 응답입니다.',
    type: CreateDiaryResponse,
  })
  @ApiResponse({
    status: 400,
    description: '실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @Post()
  async create(@Body() createDiaryDto: CreateDiaryDto) {
    return await this.diariesService.create(createDiaryDto);
  }

  @Get()
  async getPaginatedDiaries(
    @Query('page', ParseIntPipe) page: number,
    @Query('elements', ParseIntPipe) elements: number,
  ) {
    return await this.diariesService.getPaginatedDiaries(page, elements);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) diaryId: number) {
    return await this.diariesService.findOne(diaryId);
  }
}
