
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject, IsOptional } from 'class-validator';

export class FirebaseUser {
    @ApiProperty({ example: '732409753', type: String })
    userdocument: string
    @ApiProperty({ example: 'c8d9719944d14b0b9d6a1637d9302f83asdu9as8udyha9s9a0s09as9a', type: String })
    firebaseKey: string
}
