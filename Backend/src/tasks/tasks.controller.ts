import { Controller, Query, Get, Post, Body, Put, Param, Delete, Request, Req, ParseIntPipe,UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @Roles( Role.HOD, Role.ADMIN)
  async create(@Body() createTaskDto: any, @Request() req) {
    // req.user est maintenant défini grâce au Guard !
    const userId = req.user.id; 
    
    return this.tasksService.create(createTaskDto, userId);
  }


  @Get()
async findAll(@Query() filterDto: FilterTaskDto, @Req() req: any) {
    return this.tasksService.findAll(filterDto, req.user.id);
}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles( Role.HOD, Role.ADMIN )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateStatus(+id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles( Role.HOD, Role.ADMIN )
  remove(@Param('id') id: number) {
    return this.tasksService.remove(+id);
  }
}
