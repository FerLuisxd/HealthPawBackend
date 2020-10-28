import { Test, TestingModule } from '@nestjs/testing';
import { GlobalNotificationService } from './global-notification.service';

describe('GlobalNotificationService', () => {
  let service: GlobalNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalNotificationService],
    }).compile();

    service = module.get<GlobalNotificationService>(GlobalNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
