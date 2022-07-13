import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LocalSigninDto, LocalSignupDto } from './dto';
import { GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async localSignup(
    @Body() localSignupDto: LocalSignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.localSignup(localSignupDto);
    response.cookie('auth-cookie', refreshToken, { httpOnly: true });
    return { user, accessToken };
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async localSignin(
    @Body() localSignupDto: LocalSigninDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.localSignin(localSignupDto);
    response.cookie('auth-cookie', refreshToken, { httpOnly: true });
    return { user, accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const userId = req.user.id;
    const rt = req.cookies['auth-cookie'];
    return this.authService.refreshToken(userId, rt);
  }
}
