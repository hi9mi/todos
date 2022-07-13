import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LocalSignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}
