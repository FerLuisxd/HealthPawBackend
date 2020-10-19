import { Module } from '@nestjs/common';
import { FirebaseuserController } from './firebaseuser.controller';
import { FirebaseuserService } from './firebaseuser.service';

@Module({
  controllers: [FirebaseuserController],
  providers: [FirebaseuserService]
})
export class FirebaseuserModule {}
