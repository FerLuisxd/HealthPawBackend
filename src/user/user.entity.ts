
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';

export class UserClinic {
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f85', type: String })
    id: string
    @ApiProperty({ example: 'PetHealth', type: String })
    name: string
}
export class UserPet {
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f83', type: String })
    id: string
    @ApiProperty({ example: 'Firulais', type: String })
    name: string
}

export class User {
    @ApiProperty({ example: 'name', type: String })
    name: string
    @ApiProperty({ example: 'lastName', type: String })
    lastName: string
    @ApiProperty({ example: 'secondLastName', type: String })
    secondLastName: string
    @ApiProperty({ example: 'www.image.com/image.jpg', type: String })
    image: string
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f82', type: String })
    id: string
    @ApiProperty({ example: 'fsadsafsadgas', type: String })
    password: string
    @IsEmail()
    @ApiProperty({ example: 'test@test.com', type: String })
    email: string
    @ApiProperty({ example: 999351872, type: Number })
    phone: number
    @IsNotEmpty()
    @ApiProperty({ example: '732409753', type: String })
    documentNumber: string
    @ApiProperty({ example: '2020-08-07T00:57:50-05:00', type: String })
    birthDay: string
    @ApiProperty({ example: '2020-08-07T00:57:50-05:00', type: String })
    DayofRegistration: string
    @ApiProperty({ example: 2, type: Number })
    type: number
    @ApiProperty({ type: UserPet, isArray: true })
    pets: Array<UserPet>
    @ApiProperty({ type: UserClinic })
    clinic: UserClinic
}
