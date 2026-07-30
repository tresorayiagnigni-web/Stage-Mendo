// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User} from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenService } from './token.service';  // ← Ajouté 
import { UsersService } from 'src/users/users.service';
import { Role } from './enums/role.enum';



@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
     private readonly usersService: UsersService,
    
    private readonly jwtService: JwtService,

    private readonly tokenService: TokenService,   // ← Injection ajoutée
  ) {}

  async register(dto: RegisterDto) {
    const userCount = await this.usersService.count();

    // Après le premier utilisateur → inscription publique fermée
    if (userCount > 0) {
      throw new ForbiddenException(
        'L\'inscription publique est fermée. Seul un administrateur peut créer des comptes.',
      );
    }

    // Premier utilisateur = admin
    const user = await this.usersService.create(
      dto.email!,
      dto.password!,
      Role.ADMIN,
    );

    const token = this.generateToken(user);

    const { password, ...result } = user;
    return {
      message: 'Compte administrateur créé avec succès',
      access_token: token,
      user: result,
    };
  }

  // async register( createUserDto: CreateUserDto) {
  //   const { email, password, ...rest } = createUserDto;

  //   const existingUser = await this.userRepository.findOne({ where: { email } });
  //   if (existingUser) {
  //     throw new ConflictException('Un utilisateur avec cet email existe déjà');
  //   }

  //   const hashedPassword = await bcrypt.hash(password!, 10);

  //   const user = this.userRepository.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });

  //   const savedUser = await this.userRepository.save(user);
  //   delete savedUser.password;

  //   return savedUser;
  // }

  /**
   * Login mis à jour pour stocker l'access token externe
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email!);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Ajoute ce log temporaire pour débugger
  console.log('User trouvé :', user);
  console.log('Password en base :', user.password)

    const isPasswordValid = await bcrypt.compare(dto.password!, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const token = this.generateToken(user);
    const { password, ...result } = user;

    return {
      access_token: token,
      user: result,
    };
  }

  private generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  //  async login(dto: LoginDto) {
//   const { email, password } = dto;

//   const user = await this.userRepository.findOne({
//     where: { email },
//     select: {
//       id: true,
//       email: true,
//       password: true,
//       role: true,
//     },
//   });

//   if (!user || !user.password) {
//     throw new UnauthorizedException('Email ou mot de passe incorrect');
//   }

//   // if (!user.status) {
//   //   throw new UnauthorizedException('Compte inactif');
//   // }

//   const isPasswordValid = await bcrypt.compare(
//     password!,
//     user.password,
//   );

//   if (!isPasswordValid) {
//     throw new UnauthorizedException('Email ou mot de passe incorrect');
//   }

//   // Création du payload
//   const payload = {
//     sub: user.id,
//     email: user.email,
//     role: user.role,
//     departement: user.departement,
//   };

//   // Génération du JWT
//   const accessToken = await this.jwtService.signAsync(payload);

//   // Sauvegarde du JWT dans la base
//   await this.tokenService.saveAccessToken(
//     user.id!,
//     accessToken,
//   );

//   return {
//     access_token: accessToken,
//     user: {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     },
//   };
// }

  async logout(userId: number): Promise<void> {
    await this.tokenService.revokeToken(userId);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);

    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(dto.oldPassword!, user.password!);
    if (!isMatch) {
      throw new BadRequestException('Ancien mot de passe incorrect');
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(dto.newPassword!, salt);

    await this.usersService.save(user);

    return { message: 'Mot de passe modifié avec succès' };
  }
}