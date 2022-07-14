import { IsNotEmpty, IsString } from 'class-validator';

export class NoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
