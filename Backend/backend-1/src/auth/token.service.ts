import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { addHours } from 'date-fns';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async saveAccessToken(
    userId: number,
    accessToken: string,
  ): Promise<Token> {

    const expiresAt = addHours(new Date(), 24);

    // Désactiver les anciens tokens
    await this.tokenRepository.update(
      { userId, status: false },
      { status: true },
    );

    const token = this.tokenRepository.create({
      userId,
      accessToken,
      expire_le: expiresAt,
      status: false,
    });

    return await this.tokenRepository.save(token);
  }

  async getValidAccessToken(userId: number): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: {
        userId,
        status: false,
      },
      order: {
        cree_le: 'DESC',
      },
    });
  }

  async isTokenValid(token: Token): Promise<boolean> {
    if (!token) return false;

    if (token.status) return false;

    if (!token.expire_le) return false;

    return new Date() < token.expire_le;
  }

  async revokeToken(userId: number): Promise<void> {
    await this.tokenRepository.update(
      { userId, status: false },
      { status: true },
    );
  }
}