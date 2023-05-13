import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseFilters,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BoardsService } from '../../application/service/boards.service';
import { CreateBoardRequest } from '../../application/dto/request/create-board.request';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBoardResponse } from '../../application/dto/response/create-board.response';
import { FailureResult } from '../../../common/response/failure-response.format';
import { ReadBoardResponse } from '../../application/dto/response/read-board.response';
import { JwtAuthResult } from '../../../users/presentation/decorators/jwt-auth.result';
import { UserRoleExistsPipe } from '../../../users/presentation/pipes/user-role.exists.pipe';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../../users/presentation/guards/jwt-auth.guard';
import { DeleteBoardResponse } from '../../application/dto/response/delete-board.response';
import { ResultFactory } from '../../../common/response/result.factory';
import { PaginatedBoardResponse } from '../../application/dto/response/paginated-board.response';

@ApiTags('게시판')
@Controller('api/boards')
@UseFilters(HttpExceptionFilter)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOperation({
    summary: '글 작성 API 입니다',
  })
  @ApiBearerAuth('accesskey')
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
    status: 401,
    description: '유저가 올바르지 않아 글 작성에 실패합니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createRequest: CreateBoardRequest,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ) {
    return await this.boardsService.create(createRequest, user);
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
  @ApiBearerAuth('accesskey')
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
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteBoard(
    @Param('id', ParseIntPipe) boardId: number,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ) {
    return await this.boardsService.deleteBoard(user, boardId);
  }

  @ApiOperation({
    summary: '게시글을 페이지네이션 기반으로 가져오는 API 입니다',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 조회 성공 응답입니다',
    type: PaginatedBoardResponse,
  })
  @ApiResponse({
    status: 204,
    description:
      '게시글 조회에는 성공했으나, 조회된 게시물이 없는 경우의 응답입니다',
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
  @Get('')
  async getPaginatedBoards(
    @Query('page', ParseIntPipe) page: number,
    @Query('elements', ParseIntPipe) elements: number,
    @Query('words') words: string,
  ) {
    const [responseList, totalCount] =
      await this.boardsService.getPaginatedBoards(page, elements, words);

    return ResultFactory.getPaginatedSuccessResult(
      totalCount,
      page,
      elements,
      responseList,
    );
  }
}
