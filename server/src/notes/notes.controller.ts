import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { NotesService } from './notes.service';
import { NoteDto } from './dto';
import { GetCurrentUserId } from '../common/decorators';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetCurrentUserId() userId: number,
    @Body() createNoteDto: NoteDto,
  ) {
    return await this.notesService.create(userId, createNoteDto);
  }

  // add query params to filter
  // limit, offset, sortBy, sortOrder, search, favorite, unfavorite, tags
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@GetCurrentUserId() userId: number) {
    return await this.notesService.findAll(userId);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.notesService.findOne(id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return await this.notesService.delete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateNoteDto: NoteDto,
  ) {
    return await this.notesService.update(id, updateNoteDto);
  }

  // Todo: implement
  // @Post('/:id/favorite')
  // @Post('/:id/unfavorite')
  // @Get('/favorites')
  // @Get('/trash')
  // @Post('/:id/tags')
}
