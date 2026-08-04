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
    const { nom_departement, description, chef_departement } = createDepartmentDto;
    const existing = await this.departmentRepository.findOne({
      where: { nom_departement: createDepartmentDto.nom_departement },
    });

     if (existing) {
      throw new ConflictException('Ce département existe déjà');
    }

    let chef: User | null = null;

    // 2. Si un chef est fourni, on le récupère et on vérifie
    if (chef_departement) {
      chef = await this.usersRepository.findOne({
        where: { nom: chef_departement },
        relations: {departement: true},
      });
    }

    if (!chef) {
      throw new NotFoundException('Employé introuvable');
    }

    if (chef.role === Role.ADMIN) {
      throw new BadRequestException('Un administrateur ne peut pas être chef de département');
    }

    // Vérifier qu'il n'est pas déjà chef d'un autre département
    const dejaChef = await this.departmentRepository.findOne({
      where: { chef_departement: { nom: chef.nom } },
    });

    if (dejaChef) {
      throw new BadRequestException(
        `Cet employé est déjà chef du département "${dejaChef.nom_departement}"`,
      );
    }

    const department = this.departmentRepository.create({
    nom_departement,
    description,
    chef_departement: chef ?? null,
  });

  const savedDepartment = await this.departmentRepository.save(department);

  // 4. Si un chef a été nommé → passer son rôle à HOD
  //    et l'assigner à ce département
  if (chef) {
    chef.role = Role.HOD;
    chef.departement = savedDepartment;
    await this.usersRepository.save(chef);
  }

  // 5. Recharger avec la relation
  const result = await this.departmentRepository.findOne({
    where: { id: savedDepartment.id },
    relations: {chef_departement: true},
  });

  return result;
}
  

   

  

  async findAll() {
    return this.departmentRepository.find({});
  }

  async findOne(nom_depatement: string) {
    const department = await this.departmentRepository.findOne({
      where: { nom_departement: nom_depatement },
      relations: { chef_departement: true },
    });
    if (!department) throw new NotFoundException('Département non trouvé');
    return department;
  }

  async update(nom_departement: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.findOne(nom_departement);
    Object.assign(department, updateDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async remove(nom_departement: string) {
    const department = await this.findOne(nom_departement);
    await this.departmentRepository.remove(department);
    return { message: 'Département supprimé avec succès' };
  }

  async assignChef(nom_departement: string, nom: string) {
  const departement = await this.departmentRepository.findOne({
    where: { nom_departement: nom_departement },
    relations: {chef_departement: true},
  });

  if (!departement) {
    throw new NotFoundException('Département introuvable');
  }

  const user = await this.usersRepository.findOne({
    where: { nom: nom, status: true },
    relations: {departement: true},
  });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  // Vérifications métier
  if (user.role === Role.ADMIN) {
    throw new BadRequestException('Un administrateur ne peut pas être chef de département');
  }

  if (user.departement?.nom_departement !== departement.nom_departement) {
    throw new BadRequestException(
      'L\'employé doit appartenir à ce département pour en devenir le chef',
    );
  }

  // Si le département a déjà un chef → on le rétrograde en EMPLOYEE
  if (departement.chef_departement) {
    const ancienChef = departement.chef_departement;
    ancienChef.role = Role.EMPLOYEE;
    await this.usersRepository.save(ancienChef);
  }

  // Nommer le nouveau chef
  departement.chef_departement = user;
  await this.departmentRepository.save(departement);

  // Passer le rôle de l'employé à HOD
  user.role = Role.HOD;
  await this.usersRepository.save(user);

  return {
    message: `${user.nom} est maintenant chef du département ${departement.nom_departement}`,
    user: {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    },
    departement: {
      id: departement.id,
      nom_departement: departement.nom_departement,
    },
  };
}

   async removeChef(nom_departement: string) {
  const departement = await this.departmentRepository.findOne({
    where: { nom_departement: nom_departement },
    relations: {chef_departement: true},
  });

  if (!departement) {
    throw new NotFoundException('Département introuvable');
  }

  if (!departement.chef_departement) {
    throw new BadRequestException('Ce département n\'a pas de chef');
  }

  const chef = departement.chef_departement;

  // Retirer le lien
  departement.chef_departement = null;
  await this.departmentRepository.save(departement);

  // Remettre le rôle à EMPLOYEE
  chef.role = Role.EMPLOYEE;
  await this.usersRepository.save(chef);

  return {
    message: `${chef.nom} n'est plus chef de département`,
  };
}


  // async assignChef(departementId: number, dto: AssignChefDto) {
    
  // const departement = await this.departmentRepository.findOne({
  //   where: { id: departementId }
  // });

  // if (!departement) {
  //   throw new NotFoundException('Département non trouvé');
  // }

  // const user = await this.usersRepository.findOne({
  //   where: { 
  //     nom: dto.nom, 
  //     status: true 
  //   }
  // });

  // if (!user) {
  //   throw new BadRequestException('Utilisateur non trouvé ou inactif');
  // }

  // // === Mise à jour automatique du rôle ===
  // // Sauvegarder l'ancien rôle
  // const ancienRole = user.role;

  // // Modifier le rôle
  // user.role = Role.HOD;   
  // await this.usersRepository.save(user);                

  // // Assigner le chef au département
  // departement.chef_departement = user;

  // // Sauvegarder les deux entités
  // await this.usersRepository.save(user);           // ← Mise à jour du rôle
  // await this.departmentRepository.save(departement);

  // return {
  //   message: `L'utilisateur ${user.nom || ''} a été nommé Chef de Département.`,
  //   details: {
  //     ancienRole,
  //     nouveauRole: user.role
  //   },
  //   departement: {
  //     id: departement.id,
  //     nom_departement: (departement as any).nom,
  //     chef_departement: `${user.nom || ''}`.trim(),
  //   }
  // }
  // };
}
