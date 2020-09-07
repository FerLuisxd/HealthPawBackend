import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { double } from 'aws-sdk/clients/lightsail';
import { bool } from 'aws-sdk/clients/signer';

export class Pet {
    @ApiProperty({ example: 'c8d97199-44d1-4b0b-9d6a-1637d9302f82', type: String })
    id: string
    @ApiProperty({ example: 'namevar', type: String })
    namevar: string
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
    active: bool
    @ApiProperty({ example: 'perro', type: String })
    petType: string
    @ApiProperty({ example: [{ "id": "c8d97199-44d1-4b0b-9d6a-1637d9302f83", "description": "Respiración baja" }], type: Array, isArray: true })
    alerts: Array<object> // TODO: DEFINE
    @ApiProperty({
        example: [{
            "variable": "Ritmo cardiaco",
            "status": "Stable",
            "minimum": 10,
            "maximum": 20,
            "history": [
                {
                    "timestamp": new Date().getTime(),
                    "value": 15.5
                }
            ]
        }], type: Array, isArray: true
    })
    heartRate: Array<object>
    @ApiProperty({
        example: [{
            "variable": "Frecuencia respiratoria",
            "status": "Stable",
            "minimum": 10,
            "maximum": 20,
            "history": [
                {
                    "timestamp": new Date().getTime(),
                    "value": 15.5
                }
            ]
        }], type: Array, isArray: true
    })
    breathingFrequency: Array<object>
    @ApiProperty({
        example: [{
            "variable": "Sonido",
            "status": "Stable",
            "minimum": 10,
            "maximum": 20,
            "history": [
                {
                    "timestamp": new Date().getTime(),
                    "value": 15.5
                }
            ]
        }], type: Array, isArray: true
    })
    sound: Array<object>
    @ApiProperty({
        example: [{
            "variable": "Temperatura",
            "status": "Stable",
            "minimum": 10,
            "maximum": 20,
            "history": [
                {
                    "timestamp": new Date().getTime(),
                    "value": 15.5
                }
            ]
        }], type: Array, isArray: true
    })
    temperature: Array<object>

    @ApiProperty({ example: [{ "id": "c8d97199-44d1-4b0b-9d6a-1637d9302f83", "description": "Tomar más agua", "date": "2020-08-07T00:57:50-05:00" }], type: Array, isArray: true })
    recommendations: Array<object>
}
