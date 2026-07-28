import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    nom_departement?: string;

    @IsString()
    @IsOptional()
    chef_depatement?: string;

    @IsString()
    @IsOptional()
    description?: string;

    // @IsString()
    // @IsOptional()
    // id?: number;
}
