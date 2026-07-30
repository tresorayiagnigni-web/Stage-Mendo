import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum'; // adapte le chemin

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  departement?: string; // adapte selon le vrai nom du champ

  @IsOptional()
  @IsString()
  status?: string; // si tu as un champ status

  // Ajoute ici tous les autres champs que tu veux pouvoir modifier
}