import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseuserController } from './firebaseuser.controller';

describe('Firebaseuser Controller', () => {
  let controller: FirebaseuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseuserController],
    }).compile();

    controller = module.get<FirebaseuserController>(FirebaseuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
