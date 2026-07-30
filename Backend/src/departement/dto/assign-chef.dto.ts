import { IsNotEmpty, IsString } from 'class-validator';

export class AssignChefDto {
  @IsString()
  @IsNotEmpty()
  nom?: string;
}