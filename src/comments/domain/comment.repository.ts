import { Comment } from '@prisma/client';
import { UpdateCommentDto } from '../application/dto/request/update-comment.request';

export interface CommentRepository {
  create(comment: Omit<Comment, 'id'>): Promise<Comment>;

  commentCount(boardId: number): Promise<number>;

  updateComment(
    updateComment: UpdateCommentDto,
    commentId: number,
  ): Promise<Comment>;

  deleteComment(commentId: number): Promise<Comment>;
}
