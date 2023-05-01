export class ReadDiaryResponse {
  id: number;
  userId: number;
  title: string;
  content: string;
  weather: string;
  publishedDate: string;
  createdAt: Date;

  constructor(
    id: number,
    userId: number,
    title: string,
    content: string,
    weather: string,
    publishedDate: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.weather = weather;
    this.publishedDate = publishedDate;
    this.createdAt = createdAt;
  }

  static fromEntity(diary: diaryDetails): ReadDiaryResponse {
    const { id, userId, title, content, weather, publishedDate, createdAt } =
      diary;

    return new ReadDiaryResponse(
      Number(id),
      Number(userId),
      title,
      content,
      weather,
      publishedDate.toISOString().substring(0, 10),
      createdAt,
    );
  }
}

export interface diaryDetails {
  id: bigint;
  userId: bigint;
  title: string;
  content: string;
  weather: string;
  publishedDate: Date;
  createdAt: Date;
}
