import { Module } from '@nestjs/common';
import { Personervice } from './person.service';
import { PersonController } from './person.controller';

@Module({
  providers: [Personervice],
  controllers: [PersonController]
})
export class PersonModule {}
