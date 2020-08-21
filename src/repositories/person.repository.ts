import * as AWS from 'aws-sdk';
import { CreatePersonDTO } from '../modules/person/dto/createPerson.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export class PersonRepository {
    constructor() {}

    async createPerson(createPersonDto: CreatePersonDTO) {
        const newPersona = {
            id: uuid(),
            nombre: createPersonDto.nombre,
            apellido: createPersonDto.apellido,
            imagen: createPersonDto.imagen,
            usuario: createPersonDto.usuario,
            contrasenia: createPersonDto.contrasenia,
            correo: createPersonDto.correo,
            celular: createPersonDto.celular,
            dni: createPersonDto.dni,
            fechaNacimiento: createPersonDto.fechaNacimiento,
            fechaRegistro: createPersonDto.fechaRegistro,
            tipo: createPersonDto.tipo,
        };

        try {
            await new AWS.DynamoDB.DocumentClient()
                .put({
                    TableName: process.env.PERSONS_TABLE_NAME,
                    Item: newPersona,
                })
                .promise();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return { ok: true, data: newPersona };
    }

    async getPersonById(id) {
        let person;
        try {
            const result = await new AWS.DynamoDB.DocumentClient()
                .get({
                    TableName: process.env.PERSONS_TABLE_NAME,
                    Key: { id },
                })
                .promise();

            person = result.Item;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!person) {
            throw new NotFoundException(`Person with ID "${id}" not found`);
        }

        return { ok: true, data: person };
    }
}