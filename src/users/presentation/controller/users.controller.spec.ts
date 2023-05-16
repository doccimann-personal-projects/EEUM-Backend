import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersServiceImpl } from '../../application/service/users.service.impl';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersServiceImpl],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
