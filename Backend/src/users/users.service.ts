import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Departments } from 'src/departement/entities/departement.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Departments)
    private departmentRepository: Repository<Departments>,
  ) {}
  

  async create(createUserDto: CreateUserDto): Promise<User> {
  const queryRunner = this.userRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Créer l'utilisateur
    const user = this.userRepository.create(createUserDto);
    const savedUser = await queryRunner.manager.save(user);

    console.log('✅ Utilisateur créé avec ID:', savedUser.id);
    console.log('Rôle reçu:', createUserDto.role);

    // 2. Si c'est un HOD → créer le département automatiquement
    if (createUserDto.role === Role.HOD) {
      console.log('🔄 Création du département pour HOD...');
      const deptName = createUserDto.nom || 
                      `Département de ${savedUser.nom}`;

      let department = await queryRunner.manager.findOne(Departments, {
        where: { nom_departement: deptName }
      });

      if (!department) {
        department = this.departmentRepository.create({
          nom_departement: deptName,
          description: `Département dirigé par ${savedUser.id}`, 
          chef_departement: savedUser.nom,   
          
      });
        department = await queryRunner.manager.save(department);
        console.log('✅ Département créé avec ID:', department.id);
      } else {
        console.log('✅ Département existant trouvé avec ID:', department.id);
      }

      // 3. Mettre à jour l'utilisateur avec l'id du département
      // savedUser.department = department.id;
      const updateUser = await queryRunner.manager.save(savedUser);
      console.log('✅ departmentId mis à jour vers:', updateUser);
    }

    await queryRunner.commitTransaction();
    return savedUser;

  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

  //Lire tous les donnees

  async findAll() {

    return await this.userRepository.find();

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
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mise à jour sécurisée
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password; // sécurité
    return updatedUser;
  }

  //Supprimer un utilisateur
  remove(id:number){
    return this.userRepository.delete(id);

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
