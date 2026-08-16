import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const storage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, callback) => {
    const filename =
      Date.now() + extname(file.originalname);

    callback(null, filename);
  },
});

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.remove(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage,
    }),
  )
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(
      id,
      file.filename,
    );
  }

  @Patch(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage,
    }),
  )
  updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(
      id,
      file.filename,
    );
  }

  @Delete(':id/avatar')
  removeAvatar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.removeAvatar(id);
  }
}