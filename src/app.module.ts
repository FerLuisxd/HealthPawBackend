import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GlobalNotificationModule } from './global-notification/global-notification.module';

@Module({
  imports: [UserModule, PetModule,ScheduleModule.forRoot(), GlobalNotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
