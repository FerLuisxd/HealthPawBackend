import { Controller, Get, Param, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { PetService } from './pet.service';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Pet, Stadistics } from './pet.entity';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) { }

    @Get()
    async getPets() {
        return this.petService.getPets();
    }

    @ApiParam({ name: 'id', type: 'string', example: '076b508b-ae91-4902-925d-37743bd0ddd2', description: 'Pet Document' })
    @ApiResponse({ status: 200, type: Pet, description: 'Returns one Pet' })
    @Get('/:id')
    async getPet(@Param('id') id: string) {
        return this.petService.getPet(id);
    }

    @Post()
    async addPet(@Body() body: Pet) {
        return await this.petService.addPet(body);
    }

    @Put('/stadistics/:id')
    @ApiParam({ name: 'id', type: 'string', example: '076b508b-ae91-4902-925d-37743bd0ddd2', description: 'Pet Document' })
    async updatePetStadistic(@Param('id') id :string ,@Body() body: Stadistics) {
        return this.petService.updatePetStadistic(id,body);
    }

    @Put('/:id')
    async updatePet(@Param('id') id :string ,@Body() body: Pet) {
        return this.petService.updatePet(id,body);
    }
    
    @Delete('/:id')
    async deletePet(@Param('id') id: string) {
        return this.petService.deletePet(id);
    }
}
