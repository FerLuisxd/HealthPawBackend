import { Module } from '@nestjs/common';
import { GlobalNotificationController } from './global-notification.controller';
import { GlobalNotificationService } from './global-notification.service';

@Module({
  controllers: [GlobalNotificationController],
  providers: [GlobalNotificationService]
})
export class GlobalNotificationModule {}
