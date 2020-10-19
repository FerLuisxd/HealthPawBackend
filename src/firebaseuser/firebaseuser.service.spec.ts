import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseuserService } from './firebaseuser.service';

describe('FirebaseuserService', () => {
  let service: FirebaseuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseuserService],
    }).compile();

    service = module.get<FirebaseuserService>(FirebaseuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
