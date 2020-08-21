import { Controller, Get, Query, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }
  @ApiParam({ name: 'id', type: 'string', example: '732409753', description: 'User Document' })
  @ApiResponse({ status: 200, type: User, description: 'Returns one User' })
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }
  @Post()
  async addUser(@Body() body: User) {
    return await this.userService.addUser(body);
  }
  @Put('/:id')
  async updateUser(@Param('id') id: string) {
    return this.userService.updateUser(id);
  }
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

}
