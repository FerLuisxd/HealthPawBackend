import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonService {
    constructor(){
        
    }
    getPersons(): any {
      return []
    }
    getPerson(id: string): any {
      return {}
    }
    addPerson(): any {
      return {}
    }
    updatePerson( id: string): any {
      return {}
    }
    deletePerson( id: string): any {
      return {}
    }
}
