import { Controller, Post, Body, Res, HttpStatus, Get, Req, Param } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDTO } from './dto/createPerson.dto';

@Controller('person')
export class PersonController {
    constructor(private personService: PersonService) {}

    @Post('/createPerson')
    async createPerson(@Body() createPersonDto: CreatePersonDTO, @Res() res: any) {
        try {
            const newPerson: any = await this.personService.createPerson(createPersonDto);
            if (newPerson.ok) {
                return res.status(HttpStatus.CREATED).json({
                    ok: true,
                    data: newPerson.data,
                });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    ok: false,
                    message: 'Error Trying to Create Person',
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                ok: false,
                message: 'Error Trying to reach DB',
                errors: error,
            });
        }
    }

    @Get('/getPersonById/:id')
    async getPersonById(@Param('id') id: string, @Res() res: any) {
        try {
            const person: any = await this.personService.getPersonById(id);
            if (person.ok) {
                return res.status(HttpStatus.OK).json({
                    ok: true,
                    person: person.data,
                });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    ok: false,
                    message: 'Error Trying to Get Person',
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                ok: false,
                message: 'Error Trying to reach DB',
                errors: error,
            });
        }
    }
}
