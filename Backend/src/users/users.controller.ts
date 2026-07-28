import {Controller, Get, Post, Put, Delete, Param, Request, UseGuards, Patch, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from './decorators copy/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from './enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user; // L'utilisateur décodé par le JWT
  }

  //cree un user

  @Post()
  create(@Body() CreateUserDto: CreateUserDto){
   return this.usersService.create(CreateUserDto) 
  }

  //recuperer tuos les users

  @Get()
  findAll(){
    return this.usersService.findAll();
  }

  //recuperer un user avec son  id

  @Get(':id')
  findOne(@Param('id') id:number){
    return this.usersService.findOne(Number(id));
  }

  //modifier un user

  @Put(':id')
   async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,   // ← Ajout important
    
  ) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  //supprimer un user avec son id

  @Delete(':id')
  remove(@Param('id') id:number){
    return this.usersService.remove(Number(id));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Role.ADMIN)                    // Seul l'admin peut faire ça
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(+id, updateStatusDto);
  }

}
