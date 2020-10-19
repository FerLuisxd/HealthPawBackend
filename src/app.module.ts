import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { FirebaseuserModule } from './firebaseuser/firebaseuser.module';

@Module({
  imports: [UserModule, PetModule, FirebaseuserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
