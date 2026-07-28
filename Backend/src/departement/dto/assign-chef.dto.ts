import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignChefDto {
  @IsInt()
  @IsNotEmpty()
  userId?: number;
}