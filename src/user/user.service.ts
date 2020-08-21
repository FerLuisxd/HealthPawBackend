import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(){
        
    }
    getUsers(): any {
      return []
    }
    getUser(id: string): any {
      return {}
    }
    addUser(): any {
      return {}
    }
    updateUser( id: string): any {
      return {}
    }
    deleteUser( id: string): any {
      return {}
    }
}
