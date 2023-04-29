import { Board } from '@prisma/client';

export interface BoardRepository {
  // Board를 생성하는 메소드
  create(board: Omit<Board, 'id'>): Promise<Board>;

  findById(id: number): Promise<Board>;

  deleteById(id: number): Promise<Board>;

  //findLists(page: PageRequest): Promise<object>;
}
