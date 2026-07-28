import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDepartmentDto {
    @IsString()
    @IsOptional()
    nom_departement?: string;

    @IsString()
    @IsOptional()
    chef_departement?: string;

    @IsString()
    @IsOptional()
    description?: string;

    // @IsBoolean()
    // @IsOptional()
    // isActive?: boolean;
}