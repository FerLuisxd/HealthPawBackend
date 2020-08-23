import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { double } from 'aws-sdk/clients/lightsail';
import { bool } from 'aws-sdk/clients/signer';

export class Pet {
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f82', type: String })
    id: string
    @IsNotEmpty()
    @ApiProperty({ example: '732409753', type: String })
    documentNumber: string
    @ApiProperty({ example: 'name', type: String })
    name: string
    @ApiProperty({ example: 'breed', type: String })
    breed: string
    @ApiProperty({ example: 1.00, type: Number })
    size: double
    @ApiProperty({ example: 1.00, type: Number })
    weigth: double
    @ApiProperty({ example: 'www.image.com/image.jpg', type: String })
    image: string
    @ApiProperty({ example: '2020-08-07T00:57:50-05:00', type: String })
    birthDay: string
    @ApiProperty({ example: '2020-08-07T00:57:50-05:00', type: String })
    dayOfRegistration: string
    @ApiProperty({ example: false, type: Boolean })
    enabled: bool
    @ApiProperty({ example: 'perro', type: String })
    petType: string
    @ApiProperty({ example: [{ "id": "c8d97199-44d1-4b0b-9d6a-1637d9302f83", "description": "Respiración baja" }], type: Array, isArray: true })
    alerts: Array<object>
    @ApiProperty({ example: [{ "id": "c8d97199-44d1-4b0b-9d6a-1637d9302f83", "name": "Firulais", "status": "Stable", "minimum": 1.30, "maximum": 1.50, "timestamp": new Date().getTime() }], type: Array, isArray: true })
    variables: Array<object>
    @ApiProperty({ example: [{ "id": "c8d97199-44d1-4b0b-9d6a-1637d9302f83", "description": "Tomar más agua", "date": "2020-08-07T00:57:50-05:00" }], type: Array, isArray: true })
    recommendations: Array<object>
}
