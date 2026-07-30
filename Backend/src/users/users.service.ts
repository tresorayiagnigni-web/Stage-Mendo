import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Departments } from 'src/departement/entities/departement.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';
import { Project } from 'src/project/entities/project.entity';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Departments)
    private departmentRepository: Repository<Departments>,
    @InjectRepository(Project)                     // ← ajoute cette ligne
    private readonly projectRepository: Repository<Project>,
  ) {}
  
  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
     where: { 
      email 
    },
    select: {
      id: true,
      email: true,
      password: true,     // ← obligatoire
      role: true,
      nom: true,
      departement: true,
      telephone: true,
      status: true,
      createdAt: true,
    } });
  }

   async findById(id: number): Promise<User> {
  const user = await this.userRepository
    .createQueryBuilder('user')
    .where('user.id = :id', { id })
    .addSelect('user.password')   // ← force le chargement du password
    .getOne();

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  return user;
}

  // async findOne(id: number): Promise<User> {
  //   return this.findById(id);
  // }

  async create(email: string, password: string, role: Role): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

//   async create(createUserDto: CreateUserDto): Promise<User> {
//   const queryRunner = this.userRepository.manager.connection.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     // 1. Créer l'utilisateur
//     const user = this.userRepository.create(createUserDto);
//     const savedUser = await queryRunner.manager.save(user);

//     console.log('✅ Utilisateur créé avec ID:', savedUser.id);
//     console.log('Rôle reçu:', createUserDto.role);

//     // 2. Si c'est un HOD → créer le département automatiquement
//     if (createUserDto.role === Role.HOD) {
//       console.log('🔄 Création du département pour HOD...');
//       const deptName = createUserDto.nom || 
//                       `Département de ${savedUser.nom}`;

//       let department = await queryRunner.manager.findOne(Departments, {
//         where: { nom_departement: deptName }
//       });

//       if (!department) {
//         department = this.departmentRepository.create({
//           nom_departement: deptName,
//           description: `Département dirigé par ${savedUser.id}`, 
//           chef_departement: user,   
          
//       });
//         department = await queryRunner.manager.save(department);
//         console.log('✅ Département créé avec ID:', department.id);
//       } else {
//         console.log('✅ Département existant trouvé avec ID:', department.id);
//       }

//       // 3. Mettre à jour l'utilisateur avec l'id du département
//       // savedUser.department = department.id;
//       const updateUser = await queryRunner.manager.save(savedUser);
//       console.log('✅ departmentId mis à jour vers:', updateUser);
//     }

//     await queryRunner.commitTransaction();
//     return savedUser;

//   } catch (error) {
//     console.error(error);
//     await queryRunner.rollbackTransaction();
//     throw error;
//   } finally {
//     await queryRunner.release();
//   }
// }

  //Lire tous les donnees

  findAll() {

    return this.userRepository.find();

  }

  //Lire un utilisateur par son ID

  findOne(id:number){

    return this.userRepository.findOne({
      where:{id},
    });
  }

  //Modifier un utilisateur

  async update(id: number, updateUserDto: UpdateUserDto) {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
  }

  // Si le mot de passe est fourni, on le hash
  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  // On fusionne les nouvelles valeurs
  Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  // async remove(id: number) {
  //   const user = await this.userRepository.findOne({
  //     where: {
  //        nom: CreateProjectDto.name,
  //        role: Role.HOD,
  //     },
  //   });

  //   if (!user) {
  //     throw new NotFoundException("Utilisateur introuvable");
  //   }

  //   const hod = await this.userRepository.findOne({
  //     where: {
  //       role: Role.HOD,
  //       departement: user.departement,
  //       status: true,
  //     },
  //   });

  //   if (!hod) {
  //     throw new NotFoundException("Aucun Chef_de_Departement trouvé");
  //   }
  //   // Réassigne les projets à l'utilisateur id = 1 (ou un autre admin)
  //   await this.projectRepository.update(
  //     { createdBy: { id: user.id } },
  //     { createdBy: hod },
  //   );

  //   return this.userRepository.delete(id);
  // }
  
  //Supprimer un utilisateur
  // remove(id:number){
  //   return this.userRepository.delete(id);

  // }

  async remove(id: number): Promise<{ message: string }> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  await this.userRepository.remove(user);
  // ou : await this.userRepository.delete(id);

  return { message: 'Utilisateur supprimé avec succès' };
}

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Empêcher de désactiver son propre compte (optionnel mais recommandé)
   // if (user.id === currentUserId) { ... }

    user.status = dto.status;
    const updatedUser = await this.userRepository.save(user);
    return {
      message: `Utilisateur ${dto.status ? 'activé' : 'désactivé'} avec succès`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        // status: updatedUser.status
        status: Boolean(user.status)
      }
    };
  }


  async createUserWithDepartment(createUserDto: CreateUserDto): Promise<User> {
    const { departement, ...userData } = createUserDto;

    // 1. Vérifier ou créer le département
    let department = await this.departmentRepository.findOne({
      where: { nom_departement: departement },
    });

    if (!department) {
      department = this.departmentRepository.create({ nom_departement: departement });
      department = await this.departmentRepository.save(department);
      console.log(`✅ Département créé : ${departement}`);
    }

    // 2. Créer l'utilisateur
    const user = this.userRepository.create({
      ...userData,
      // chef_Departement: department, 
    });

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
  
}
