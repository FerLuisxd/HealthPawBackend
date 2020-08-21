import { IsNotEmpty } from 'class-validator';

export class CreatePersonDTO {
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    apellido: string;

    imagen: string;

    @IsNotEmpty()
    usuario: string;

    @IsNotEmpty()
    contrasenia: string;

    @IsNotEmpty()
    correo: string;

    @IsNotEmpty()
    celular: string;

    @IsNotEmpty()
    dni: string;

    @IsNotEmpty()
    fechaNacimiento: string;

    @IsNotEmpty()
    fechaRegistro: string;

    @IsNotEmpty()
    tipo: string;
}