import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardRequest } from './create-board.request';

export class UpdateBoardRequestDto extends PartialType(CreateBoardRequest) {}
