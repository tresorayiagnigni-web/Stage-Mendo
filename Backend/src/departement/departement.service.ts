import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departments } from './entities/departement.entity';
import { CreateDepartmentDto } from './dto/create-departement.dto';
import { UpdateDepartmentDto } from './dto/update-departement.dto';
import { AssignChefDto } from './dto/assign-chef.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Departments)
    private departmentRepository: Repository<Departments>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const existing = await this.departmentRepository.findOne({
      where: { nom_departement: createDepartmentDto.nom_departement },
    });

    if (existing) {
      throw new ConflictException('Ce département existe déjà');
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async findAll() {
    return this.departmentRepository.find({});
  }

  async findOne(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      
    });
    if (!department) throw new NotFoundException('Département non trouvé');
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.findOne(id);
    Object.assign(department, updateDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
    return { message: 'Département supprimé avec succès' };
  }


  async assignChef(departementId: number, dto: AssignChefDto) {
    
  const departement = await this.departmentRepository.findOne({
    where: { id: departementId }
  });

  if (!departement) {
    throw new NotFoundException('Département non trouvé');
  }

  const user = await this.usersRepository.findOne({
    where: { 
      id: dto.userId, 
      status: true 
    }
  });

  if (!user) {
    throw new BadRequestException('Utilisateur non trouvé ou inactif');
  }

  // === Mise à jour automatique du rôle ===
  user.role = Role.HOD;   
  await this.usersRepository.save(user);                

  // Assigner le chef au département
  departement.chef_departement = user.id?.toString(),

  // Sauvegarder les deux entités
  await this.usersRepository.save(user);           // ← Mise à jour du rôle
  await this.departmentRepository.save(departement);

  return {
    message: `L'utilisateur ${user.nom || ''} a été nommé Chef de Département.`,
    details: {
      ancienRole: user.role,
      nouveauRole: user.role
    },
    departement: {
      id: departement.id,
      nom_departement: (departement as any).nom,
      chef_departementId: user.id,
      nom: `${user.nom || ''}`.trim(),
    }
  }
  };
}
