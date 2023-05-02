import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardsService } from '../../application/service/boards.service';
import { CreateBoardRequest } from '../../application/dto/request/create-board.request';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleSuccessResult } from '../../../common/response/success-response.format';
import { CreateBoardResponse } from '../../application/dto/response/create-board.response';
import { FailureResult } from '../../../common/response/failure-response.format';
import { ReadBoardResponse } from '../../application/dto/response/read-board.response';
import { DeleteBoardResponse } from '../../application/dto/response/delete-board.response';

@ApiTags('게시판')
@Controller('api/boards')
@UseFilters(HttpExceptionFilter)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOperation({
    summary: '글 작성 API 입니다',
  })
  @ApiResponse({
    status: 200,
    description: '글작성 성공 응답입니다',
    type: CreateBoardResponse,
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
  async create(@Body() createRequest: CreateBoardRequest) {
    return await this.boardsService.create(createRequest);
  }

  @ApiOperation({
    summary: '게시글 상세조회 API 입니다',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 상세 조회 성공 응답입니다',
    type: ReadBoardResponse,
  })
  @ApiResponse({
    status: 204,
    description: '게시물이 존재하지 않는 경우의 응답입니다',
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @Get('/:id')
  getBoard(@Param('id', ParseIntPipe) boardId: number) {
    return this.boardsService.getDetailBoard(boardId);
  }

  @ApiOperation({
    summary: '게시글 삭제 API 입니다',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공 응답입니다',
    type: DeleteBoardResponse,
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
  @Delete('/:id')
  async unregister(@Param('id', ParseIntPipe) boardId: number) {
    return await this.boardsService.deleteBoard(boardId);
  }
}
