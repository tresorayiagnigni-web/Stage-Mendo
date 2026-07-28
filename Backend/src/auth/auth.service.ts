// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenService } from './token.service';  // ← Ajouté 



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly tokenService: TokenService,   // ← Injection ajoutée
  ) {}

  async register( createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password!, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;

    return savedUser;
  }

  /**
   * Login mis à jour pour stocker l'access token externe
   */
 async login(dto: LoginDto, externalAccessToken: string) {
  const { email, password } = dto;

  const user = await this.userRepository.findOne({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user || !user.password) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  const isPasswordValid = await bcrypt.compare(
    password!,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  // Création du payload
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  // Génération du JWT
  const accessToken = await this.jwtService.signAsync(payload);

  // Sauvegarde du JWT dans la base
  await this.tokenService.saveAccessToken(
    user.id!,
    accessToken,
  );

  return {
    access_token: accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

  async logout(userId: number): Promise<void> {
    await this.tokenService.revokeToken(userId);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ 
      where: {
       id: userId 
      },
      select: {
        id: true,
        password: true,
        email: true,
        nom: true,
      } 
    });

    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(dto.oldPassword!, user.password!);
    if (!isMatch) {
      throw new BadRequestException('Ancien mot de passe incorrect');
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(dto.newPassword!, salt);

    await this.userRepository.save(user);

    return { message: 'Mot de passe modifié avec succès' };
  }
}