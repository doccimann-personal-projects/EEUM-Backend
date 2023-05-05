import { Comment } from '@prisma/client';

export interface CommentRepository {
  create(comment: Omit<Comment, 'id'>): Promise<Comment>;
}
