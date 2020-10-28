import { Test, TestingModule } from '@nestjs/testing';
import { GlobalNotificationController } from './global-notification.controller';

describe('GlobalNotification Controller', () => {
  let controller: GlobalNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalNotificationController],
    }).compile();

    controller = module.get<GlobalNotificationController>(GlobalNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
