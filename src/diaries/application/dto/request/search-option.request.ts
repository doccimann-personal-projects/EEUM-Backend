import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SearchOption {
  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsNotEmpty()
  elements: string;

  toSearchEntity() {
    return {
      page: Number(this.page),
      elements: Number(this.elements),
    };
  }
}
