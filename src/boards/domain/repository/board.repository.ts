import { Board } from '@prisma/client';
import { BoardWithCommentsEntity } from '../entity/board-with-comments.entity';

export interface BoardRepository {
  // Board를 생성하는 메소드
  create(board: Omit<Board, 'id' | 'commentCount'>): Promise<Board>;

  findById(id: number): Promise<Board | null>;

  findDetailBoardById(id: number): Promise<BoardWithCommentsEntity | null>;

  // userId를 기반으로 user의 모든 게시물을 조회하는 메소드
  findAllBoardsByUserId(
    userId: number,
    page: number,
    elements: number,
  ): Promise<Array<Board>>;

  updateBoardById(board: Partial<Board>, id: number): Promise<Board>;

  deleteById(id: number): Promise<Board>;

  // 게시물의 총 개수를 반환하는 메소드
  getTotalCount(): Promise<number>;

  // 유저가 가지고있는 게시물의 총 개수를 반환하는 메소드
  getCountByUserId(userId: number): Promise<number>;

  // 페이지네이션 기반으로 게시물을 최신순으로 가져오는 메소드
  getBoardsByPagination(page: number, elements: number): Promise<Array<Board>>;

  // 페이지네이션 기반으로 게시물을 검색하여 최신순으로 가져오는 메소드
  getSearchedBoardsByPagination(
    page: number,
    elements: number,
    words: string,
  ): Promise<Array<Board>>;

  // 조회수를 변화시키는 메소드
  updateViewCountById(boardId: number, count: number): Promise<Board | null>;

  // 댓글의 개수를 변화시키는 메소드
  updateCommentCountById(boardId: number, count: number): Promise<Board | null>;
}
