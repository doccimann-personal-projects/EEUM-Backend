import { Board } from '@prisma/client';
import { getCurrentUtcDate } from '../../../common/utils/date-utils';

// 게시글의 조회수를 변화시키는데 사용하는 prisma data를 정의하는 메소드
export function getTransformViewsData(
  board: Board,
  count: number,
): Partial<Board> {
  return {
    views: board.views + count,
    updatedAt: getCurrentUtcDate(),
  };
}

// 게시글의 댓글 개수를 변화시키는데 사용하는 prisma data를 정의하는 메소드
export function getTransformCommentCountData(
  board: Board,
  count: number,
): Partial<Board> {
  return {
    commentCount: board.commentCount + count,
    updatedAt: getCurrentUtcDate(),
  };
}
