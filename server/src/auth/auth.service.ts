import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { LocalSigninDto, LocalSignupDto } from './dto';
import { JwtTypes } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    createdAt: true,
    updatedAt: true,
  };

  async localSignup(localSignupDto: LocalSignupDto) {
    try {
      const { email, password, ...rest } = localSignupDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new HttpException(
          { status: 409, message: 'User already exists' },
          409,
        );
      }

      const hash = await argon.hash(password);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          email,
          hash,
        },
        select: this.userSelect,
      });

      const accessToken = await this.generateJWT(user, 'access');
      const refreshToken = await this.generateJWT(user, 'refresh');
      await this.updateRtHash(user.id, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials incorrect');
      }
      throw new HttpException(
        { status: 500, message: 'Something went wrong', error },
        500,
      );
    }
  }

  async localSignin(localSignupDto: LocalSigninDto) {
    try {
      const { email, password } = localSignupDto;

      const { hash, ...user } = await this.prisma.user.findUnique({
        where: { email },
        select: { ...this.userSelect, hash: true },
      });

      if (!user || !hash) {
        throw new HttpException(
          { status: 404, message: 'Credentials incorrect' },
          404,
        );
      }

      const isValid = await argon.verify(hash, password);

      if (!isValid) {
        throw new HttpException(
          { status: 401, message: 'Credentials incorrect' },
          401,
        );
      }

      const accessToken = await this.generateJWT(user, 'access');
      const refreshToken = await this.generateJWT(user, 'refresh');
      await this.updateRtHash(user.id, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials incorrect');
      }
      throw new HttpException(
        { status: 500, message: 'Something went wrong', error },
        500,
      );
    }
  }

  async logout(userId: number) {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          rtHash: {
            not: null,
          },
        },
        data: {
          rtHash: null,
        },
      });

      return true;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials incorrect');
      }
      throw new HttpException(
        { status: 500, message: 'Something went wrong', error },
        500,
      );
    }
  }

  async refreshToken(userId: number, rt: string) {
    const { rtHash, ...user } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { ...this.userSelect, rtHash: true },
    });
    if (!user || !rtHash) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(rtHash, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const accessToken = await this.generateJWT(user, 'access');

    return { user, accessToken };
  }

  async updateRtHash(userId: number, rt: string) {
    const rtHash = await argon.hash(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { rtHash },
    });
  }

  async generateJWT(user: Omit<User, 'hash' | 'rtHash'>, type: JwtTypes) {
    const secretKeys = {
      access: this.config.get<string>('AT_SECRET'),
      refresh: this.config.get<string>('RT_SECRET'),
    };

    const expiresIn = type === 'access' ? '15m' : '7d';

    const token = await this.jwtService.signAsync(user, {
      secret: secretKeys[type],
      expiresIn,
    });

    return token;
  }
}
