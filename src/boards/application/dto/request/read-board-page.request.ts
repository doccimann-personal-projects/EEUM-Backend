import { IsOptional, IsString } from 'class-validator';

export class PageRequest {
  @IsString()
  @IsOptional()
  pageNo?: number | 1;

  @IsString()
  @IsOptional()
  pageSize?: number | 10;

  toBoardPageEntity() {
    return {
      pageNo: Number(this.pageNo),
      pageSize: Number(this.pageSize),
    };
  }

  /*
    getOffSet() {
        if (this.pageNo < 1 || this.pageNo === null || this.pageNo === undefined) {
            this.pageNo = 1;
        }

        if (this.pageSize < 1 || this.pageSize === null || this.pageSize === undefined) {
            this.pageSize = 10;
        }

        return (Number(this.pageNo) - 1) * Number(this.pageSize);
    }

    getLimit() {
        if (this.pageSize < 1 || this.pageSize === null || this.pageSize === undefined) {
            this.pageSize = 10;
        }
        return Number(this.pageSize);
    }*/
}
