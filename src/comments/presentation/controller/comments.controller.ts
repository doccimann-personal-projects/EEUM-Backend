import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../../application/service/comments.service';
import { CreateCommentRequest } from '../../application/dto/request/create-comment.request';
import { UpdateCommentDto } from '../../application/dto/request/update-comment.request';
import { JwtAuthGuard } from 'src/users/presentation/guards/jwt-auth.guard';
import { JwtAuthResult } from 'src/users/presentation/decorators/jwt-auth.result';
import { UserRoleExistsPipe } from 'src/users/presentation/pipes/user-role.exists.pipe';
import { User } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentResponse } from 'src/comments/application/dto/response/create-comment.response';
import { FailureResult } from '../../../common/response/failure-response.format';
import { DeleteCommentResponse } from 'src/comments/application/dto/response/delete-comment.response';
import { UpdateCommentResponse } from 'src/comments/application/dto/response/update-comment.response';

@ApiTags('게시판 댓글')
@Controller('api/boards/:boardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글을 작성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 작성 성공 응답입니다.',
    type: CreateCommentResponse,
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
  @Post()
  async create(
    @Body() createComment: CreateCommentRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
    @JwtAuthResult(UserRoleExistsPipe)
    user: User,
  ) {
    return this.commentsService.create(createComment, user, boardId);
  }

  @ApiOperation({
    summary: '댓글을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공 응답입니다.',
    type: UpdateCommentResponse,
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
  @Patch('/:commentId')
  async update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateComment: UpdateCommentDto,
  ) {
    return this.commentsService.update(updateComment, commentId);
  }

  @ApiOperation({
    summary: '댓글을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공 응답입니다.',
    type: DeleteCommentResponse,
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
  @Delete('/:commentId')
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return await this.commentsService.deleteComment(boardId, commentId);
  }
}
