import { Controller, Get, Query, Post, Put, Delete } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @Get()
    getPersons(): any {
      return this.personService.getPersons();
    }
    @Get('/:id')
    getPerson(@Query('id') id: string): any {
      return this.personService.getPerson(id);
    }
    @Post()
    addPerson(): any {
      return this.personService.addPerson();
    }
    @Put('/:id')
    updatePerson(@Query('id') id: string): any {
      return this.personService.updatePerson(id);
    }
    @Delete('/:id')
    deletePerson(@Query('id') id: string): any {
      return this.personService.deletePerson(id);
    }

}
