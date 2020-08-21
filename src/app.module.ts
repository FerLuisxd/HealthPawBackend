import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonController } from './modules/person/person.controller';
import { PersonModule } from './modules/person/person.module';

@Module({
  imports: [PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
