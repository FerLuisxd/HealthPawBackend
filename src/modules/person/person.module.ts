import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PersonRepository } from '../../repositories/person.repository';

@Module({
  providers: [PersonService, PersonRepository],
  controllers: [PersonController]
})
export class PersonModule {}
