import { Controller, Get, Patch, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DepartmentService } from './departement.service';
import { CreateDepartmentDto } from './dto/create-departement.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { UpdateDepartmentDto } from './dto/update-departement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AssignChefDto } from './dto/assign-chef.dto';
import { NOMEM } from 'dns';

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles( Role.ADMIN )
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @GetUser() user: any,
  ) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles( Role.ADMIN )
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':nom_departement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Role.ADMIN)
  findOne(@Param('nom_departement') nom_departement: string) {
    return this.departmentService.findOne(nom_departement);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('nom_departement') nom_departement: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(nom_departement, updateDepartmentDto);
  }

  @Patch(':id/chef')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Role.ADMIN)
  async assignchefDepartement(
    @Param('nom_departement') nom_departement: string,
    @Body('nom') nom: string,
  ) {
    return this.departmentService.assignChef(nom_departement, nom);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('nom_departement') nom_departement: string) {
    return this.departmentService.remove(nom_departement);
  }
}