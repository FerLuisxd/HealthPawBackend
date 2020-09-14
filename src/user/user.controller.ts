import { Controller, Get, Query, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserPet } from './user.entity';
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
  @Post('/login')
  async login(@Body() body: User) {
    return await this.userService.login(body);
  }
  @Put('/:id')
  async updateUser(@Param('id') id: string,@Body() body: User) {
    return this.userService.updateUser(id,body);
  }
  @Put('/:id/addPet/')
  @ApiResponse({ status: 200, type: User, description: 'Returns one User' })
  async addPetToUser(@Param('id') id: string,@Body() pet: UserPet) {
    return this.userService.addPetToUser(id,pet);
  }
  @Put('/:id/editPet/')
  @ApiResponse({ status: 200, type: User, description: 'Returns one User' })
  async updatePetToUser(@Param('id') id: string,@Body() pet: UserPet) {
    return this.userService.editPetToUser(id,pet);
  }
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

}
