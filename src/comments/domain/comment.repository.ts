import { Comment } from '@prisma/client';

export interface CommentRepository {
  create(comment: Omit<Comment, 'id'>): Promise<Comment>;

  findComment(boardId: bigint): Promise<Array<Comment>>;

  commentCount(boardId: number): Promise<number>;
}
