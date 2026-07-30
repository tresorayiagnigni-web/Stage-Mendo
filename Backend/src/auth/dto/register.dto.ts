// register.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    nom?: string;

    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @MinLength(6)
    password?: string;

    @IsEnum(Role, { message: 'Rôle invalide. Valeurs acceptées : , hod, employee' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    role?: Role;

    // autres champs...
}