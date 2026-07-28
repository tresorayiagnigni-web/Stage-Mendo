import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // Si la stratégie a levé une erreur ou n'a pas retourné d'utilisateur
    if (err || !user) {
      throw err || new UnauthorizedException('Compte inactif ou inexistant');
    }
    return user;
  }
}