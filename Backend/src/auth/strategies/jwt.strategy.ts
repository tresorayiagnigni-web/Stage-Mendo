import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


export interface JwtPayload {
  sub: number; // L'ID de l'utilisateur
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ||'JWT_SECRET',
    });
  }

  async validate(payload: JwtPayload) {
    
    console.log('Payload :', payload);
    const userId = payload.sub;

    // 2. Recherche de l'utilisateur en BDD via l'ID extrait du token
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    console.log('User:',user );

    if (!user) {
      throw new UnauthorizedException('Utilisateur inexistant');
    }

    if (!user.status) {
      throw new UnauthorizedException('Compte inactif');
    }

    return user;

    // return {
    //   id: user.id,
    //   email: user.email,
    //   role: user.role,       // Important pour le RolesGuard
    // };
  }
}