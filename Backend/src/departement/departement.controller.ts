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

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOD, Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Patch(':id/chef')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Role.ADMIN)
  async assignchefDepartement(
    @Param('id', ParseIntPipe) departementId: number,
    @Body() dto: AssignChefDto,
  ) {
    return this.departmentService.assignChef(departementId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}