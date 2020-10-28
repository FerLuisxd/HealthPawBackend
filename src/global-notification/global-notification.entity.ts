
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject, IsOptional } from 'class-validator';

export class GlobalNotification {
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f82', type: String })
    id: string
    @ApiProperty({ example: 'Notification Title', type: String })
    title: string
    @ApiProperty({ example: 'Notification Body', type: String })
    body: string
    @ApiProperty({ example: '2020-08-07T00:57:50-05:00', type: String })
    date: string
    @ApiProperty({ example: false, type: Boolean })
    sent: boolean
}
