import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  nom?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;


  // @IsNotEmpty()
  // @IsString()
  // departement?: string;

  @IsNotEmpty()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

}