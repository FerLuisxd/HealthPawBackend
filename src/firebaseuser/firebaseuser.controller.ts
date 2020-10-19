import { Controller, Get, Param, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { FirebaseUser } from './firebaseuser.entity';
import { FirebaseuserService } from './firebaseuser.service';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('firebaseuser')
export class FirebaseuserController {

    constructor(private readonly firebaseuserService: FirebaseuserService) { }

    @ApiParam({ name: 'userdocument', type: 'string', example: '076b508b-ae91-4902-925d-37743bd0ddd2', description: 'Firebase User Document' })
    @ApiResponse({ status: 200, type: FirebaseUser, description: 'Returns one Firebase User' })
    @Get('/:user_document')
    async getPet(@Param('userDocument') userDocument: string) {
        return this.firebaseuserService.getKey(userDocument);
    }

    @Post()
    async addPet(@Body() body: FirebaseUser) {
        return await this.firebaseuserService.addKey(body);
    }
}
