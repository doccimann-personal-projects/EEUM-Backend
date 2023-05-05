export class ReadCommentResponse {
  comment: Array<toIntCommentInfo>;

  constructor(comment: Array<toIntCommentInfo>) {
    this.comment = comment;
  }

  static fromEntity(comment: Array<commentInfo>): ReadCommentResponse | null {
    const comments: Array<toIntCommentInfo> = comment.reduce(
      (map: Array<toIntCommentInfo>, value: commentInfo) => {
        const obj = {
          id: Number(value['id']),
          content: value['content'],
          createdAt: value['createdAt'],
        };
        map.push(obj);
        return map;
      },
      [],
    );
    return new ReadCommentResponse(comments);
  }
}

export interface toIntCommentInfo {
  id: number;
  content: string;
  createdAt: Date;
}

export interface commentInfo {
  id: bigint;
  content: string;
  createdAt: Date;
}
