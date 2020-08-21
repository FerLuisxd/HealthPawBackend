import { Injectable } from '@nestjs/common';
import { PersonRepository } from 'src/repositories/person.repository';
import { CreatePersonDTO as CreatePersonDTO } from './dto/createPerson.dto';

@Injectable()
export class PersonService {
    constructor(private personRepository: PersonRepository) {}

    async createPerson(createOrderDto: CreatePersonDTO) {
        const createdOffer = await this.personRepository.createPerson(createOrderDto);
        return createdOffer;
    }

    async getPersonById(id) {
        const Order = await this.personRepository.getPersonById(id);
        return Order;
    }
}
