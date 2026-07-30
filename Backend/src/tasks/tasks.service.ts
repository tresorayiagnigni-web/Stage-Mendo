import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import { title } from 'process';




@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)                          // ← Ajoute cette ligne
  private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, currentUser: User) {
  const { title, description, nom_employer } = createTaskDto;

  // 1. Trouver l'employé par son nom
  const employee = await this.userRepository.findOne({
    where: {
      nom: nom_employer,
      role: Role.EMPLOYEE,
    },
  });

  if (!employee) {
    throw new NotFoundException(`Employé "${nom_employer}" introuvable`);
  }

  // 2. Règles d'assignation selon le rôle
  if (currentUser.role === Role.ADMIN) {
    // ADMIN peut assigner à n'importe quel employé → OK
  } 
  else if (currentUser.role === Role.HOD) {
    const deptHOD = currentUser.departement?.nom_departement;
  const deptEmployee = employee.departement?.nom_departement;

  console.log('=== DEBUG ===');
  console.log('HOD     :', currentUser.departement);
  console.log('Employé :', employee.departement);
  console.log('Comparaison normalisée :', deptHOD, '===', deptEmployee);

  if (!deptHOD || !deptEmployee || deptHOD !== deptEmployee) {
    throw new ForbiddenException(
      'Vous ne pouvez assigner une tâche qu\'à un employé de votre département',
    );
    // HOD ne peut assigner qu'à un employé de son département
    // On compare les valeurs string de "departement"
    // if (employee.departement !== currentUser.departement) {
    //   throw new ForbiddenException(
    //     'Vous ne pouvez assigner une tâche qu\'à un employé de votre département',
    //   );
    // }
  } 
}
  else {
    throw new ForbiddenException('Seul un ADMIN ou un HOD peut créer une tâche');
  }

  // 3. Création de la tâche (attention au nom du champ : titre)
  const task = this.taskRepository.create({
    title: title,                
    description: description,
    user: employee,
  });

  return this.taskRepository.save(task);
  }


  async findAll(filterDto: FilterTaskDto = {}, userId: number): Promise<Task[]> {
    const { status, priorite, search } = filterDto;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });   // Correction principale

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (priorite) {
      query.andWhere('task.priority = :priorite', { priorite }); // corrigé le nom
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: number, userId?: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, ...(userId && { userId }) },
    });

    if (!task) {
      throw new NotFoundException(`Task avec l'id ${id} non trouvée`);
    }
    return task;
  }

  async updateStatus(id: number, updateTaskDto: UpdateTaskDto, userId?: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}