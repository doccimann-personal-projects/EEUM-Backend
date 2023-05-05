import { PartialType } from '@nestjs/swagger';
import { CreateDiaryRequest } from './create-diary.request';

export class UpdateDiaryDto extends PartialType(CreateDiaryRequest) {}
