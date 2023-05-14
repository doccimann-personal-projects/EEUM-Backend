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
  UseGuards, UseFilters,
} from '@nestjs/common';
import { DiariesService } from '../../application/service/diaries.service';
import { CreateDiaryRequest } from '../../application/dto/request/create-diary.request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDiaryResponse } from '../../application/dto/response/create-diary.response';
import { FailureResult } from '../../../common/response/failure-response.format';
import { ResultFactory } from 'src/common/response/result.factory';
import { ReadDiaryResponse } from 'src/diaries/application/dto/response/read-diary.response';
import { DeleteDiaryResponse } from 'src/diaries/application/dto/response/delete-diary.response';
import { JwtAuthGuard } from 'src/users/presentation/guards/jwt-auth.guard';
import { JwtAuthResult } from 'src/users/presentation/decorators/jwt-auth.result';
import { UserRoleExistsPipe } from 'src/users/presentation/pipes/user-role.exists.pipe';
import { User } from '@prisma/client';
import { PaginatedDiaryResponse } from '../../application/dto/response/paginated-diary.response';
import {HttpExceptionFilter} from "../../../common/filters/http-exception.filter";

@ApiTags('일기')
@UseFilters(HttpExceptionFilter)
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
  // 일기 작성
  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDiaryDto: CreateDiaryRequest,
    // @JwtAuthResult(UserRoleExistsPipe) user: User,
  ): Promise<CreateDiaryResponse> {
    // return await this.diariesService.create(user, createDiaryDto);
    return await this.diariesService.create(createDiaryDto);
  }

  @ApiOperation({
    summary: '자신의 일기 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일기 목록 조회 성공 응답입니다.',
    type: PaginatedDiaryResponse,
  })
  @ApiResponse({
    status: 204,
    description: '아무런 일기를 조회하지 못한 경우',
    type: null,
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
  // 자신의 일기 목록 조회
  // @UseGuards(JwtAuthGuard)
  @Get()
  async getPaginatedDiaries(
    @Query('page', ParseIntPipe) page: number,
    @Query('elements', ParseIntPipe) elements: number,
    // @JwtAuthResult(UserRoleExistsPipe) user: User,
  ) {
    const [diariesResponse, totalElements] =
      await this.diariesService.getPaginatedDiaries(1, page, elements);

    return ResultFactory.getPaginatedSuccessResult(
      totalElements,
      page,
      elements,
      diariesResponse,
    );
  }

  @ApiOperation({
    summary: '자신의 일기를 상세 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일기 상세 조회 성공 응답입니다.',
    type: ReadDiaryResponse,
  })
  @ApiResponse({
    status: 204,
    description: '아무런 일기를 조회하지 못한 경우',
    type: null,
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
  // 일기 상세조회
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findDiary(@Param('id', ParseIntPipe) diaryId: number) {
    return await this.diariesService.findDiary(diaryId);
  }

  @ApiOperation({
    summary: '자신의 일기를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일기 삭제 성공 응답입니다.',
    type: DeleteDiaryResponse,
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
  // 일기 삭제
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDiary(@Param('id', ParseIntPipe) diaryId: number) {
    return await this.diariesService.deleteDiary(diaryId);
  }
}
