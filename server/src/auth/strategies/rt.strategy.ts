import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      secretOrKey: config.get<string>('RT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.cookieExtractor]),
    });
  }

  private static cookieExtractor(request: Request) {
    if (request.cookies && 'auth-cookie' in request.cookies) {
      return request.cookies['auth-cookie'];
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
