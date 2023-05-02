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

@ApiTags('게시판')
@Controller('api/boards')
@UseFilters(HttpExceptionFilter)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

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

  @Get('/:id')
  getBoard(@Param('id', ParseIntPipe) boardId: number) {
    return this.boardsService.getDetailBoard(boardId);
  }

  @Delete('/:id')
  async unregister(@Param('id', ParseIntPipe) boardId: number) {
    return await this.boardsService.deleteBoard(boardId);
  }
}
