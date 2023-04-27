import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiariesService } from '../application/service/diaries.service';
import { CreateDiaryDto } from '../application/dto/request/create-diary.request';
import { UpdateDiaryDto } from '../application/dto/request/update-diary.request';

@Controller('api/diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diariesService.create(createDiaryDto);
  }
}
