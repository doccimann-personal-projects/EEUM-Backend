import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../../application/service/comments.service';
import { CreateCommentRequest } from '../../application/dto/request/create-comment.request';
import { UpdateCommentDto } from '../../application/dto/request/update-comment.request';
import { JwtAuthGuard } from 'src/users/presentation/guards/jwt-auth.guard';
import { JwtAuthResult } from 'src/users/presentation/decorators/jwt-auth.result';
import { UserRoleExistsPipe } from 'src/users/presentation/pipes/user-role.exists.pipe';
import { User } from '@prisma/client';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createComment: CreateCommentRequest,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ) {
    return this.commentsService.create(createComment, user);
  }
}
