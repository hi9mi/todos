import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { NoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createNoteDto: NoteDto) {
    try {
      return await this.prisma.notes.create({
        data: {
          ...createNoteDto,
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException({ status: 409, message: error.message }, 409);
      }
      throw new HttpException(
        { status: 500, message: 'Internal server error', error: error },
        500,
      );
    }
  }

  async findAll(userId: number) {
    try {
      return await this.prisma.notes.findMany({
        where: { userId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException({ status: 409, message: error.message }, 409);
      }
      throw new HttpException(
        { status: 500, message: 'Internal server error', error: error },
        500,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.notes.findUnique({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException({ status: 409, message: error.message }, 409);
      }
      throw new HttpException(
        { status: 500, message: 'Internal server error', error: error },
        500,
      );
    }
  }

  async delete(id: number) {
    try {
      const note = await this.prisma.notes.findUnique({
        where: { id },
      });

      await this.prisma.notes.delete({
        where: { id },
      });
      return { status: 200, message: `Deleted ${note.title}` };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException({ status: 409, message: error.message }, 409);
      }
      throw new HttpException(
        { status: 500, message: 'Internal server error', error: error },
        500,
      );
    }
  }

  async update(id: number, updateNoteDto: NoteDto) {
    try {
      return await this.prisma.notes.update({
        where: { id },
        data: {
          ...updateNoteDto,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException({ status: 409, message: error.message }, 409);
      }
      throw new HttpException(
        { status: 500, message: 'Internal server error', error: error },
        500,
      );
    }
  }
}
