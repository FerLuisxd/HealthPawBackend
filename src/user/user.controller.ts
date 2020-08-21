import { Controller, Get, Query, Post, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers(): any {
      return this.userService.getUsers();
    }
    @Get('/:id')
    getUser(@Query('id') id: string): any {
      return this.userService.getUser(id);
    }
    @Post()
    addUser(): any {
      return this.userService.addUser();
    }
    @Put('/:id')
    updateUser(@Query('id') id: string): any {
      return this.userService.updateUser(id);
    }
    @Delete('/:id')
    deleteUser(@Query('id') id: string): any {
      return this.userService.deleteUser(id);
    }

}
