import { Board, Comment } from '@prisma/client';

export type BoardWithCommentsEntity = Board & {
  commentList: Array<Comment>;
};
