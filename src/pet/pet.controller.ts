import { Controller, Get, Param, Post, Put, Delete, Body } from '@nestjs/common';
import { PetService } from './pet.service';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Pet } from './pet.entity';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) { }

    @Get()
    async getPets() {
        return this.petService.getPets();
    }

    @ApiParam({ name: 'id', type: 'string', example: '784521321', description: 'Pet Document' })
    @ApiResponse({ status: 200, type: Pet, description: 'Returns one Pet' })
    @Get('/:id')
    async getPet(@Param('id') id: string) {
        return this.petService.getPet(id);
    }

    @Post()
    async addPet(@Body() body: Pet) {
        return await this.petService.addPet(body);
    }

    @Put('/:id')
    async updatePet(@Body() body: Pet) {
        return this.petService.updatePet(body);
    }
    
    @Delete('/:id')
    async deletePet(@Param('id') id: string) {
        return this.petService.deletePet(id);
    }
}
