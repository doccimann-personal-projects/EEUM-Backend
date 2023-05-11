import { Board } from '@prisma/client';
import { commentBoard } from 'src/boards/application/dto/response/read-board.response';

export interface BoardRepository {
  // Board를 생성하는 메소드
  create(board: Omit<Board, 'id' | 'commentCount'>): Promise<Board>;

  findAliveBoardById(id: number): Promise<commentBoard | null>;

  deleteById(id: number): Promise<Board>;

  // 게시물의 총 개수를 반환하는 메소드
  getTotalCount(): Promise<number>;

  // 페이지네이션 기반으로 게시물을 최신순으로 가져오는 메소드
  getBoardsByPagination(
    page: number,
    elements: number,
    words: string,
  ): Promise<Array<Board>>;

  updateCommentCount(id: number, counts: number): Promise<Board>;
}
