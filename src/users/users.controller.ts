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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const storage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, callback) => {
    const filename =
      Date.now() + extname(file.originalname);

    callback(null, filename);
  },
});

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // ==========================================
  // GET ALL USERS
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll() {
    return this.userService.findAll();
  }

  // ==========================================
  // GET USER BY ID
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get user by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.findOne(id);
  }

  // ==========================================
  // CREATE USER
  // PUBLIC
  // ==========================================
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Lyheang',
        },
        email: {
          type: 'string',
          example: 'lyheang@gmail.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
        phone: {
          type: 'string',
          example: '012345678',
        },
        role: {
          type: 'string',
          enum: ['TENANT', 'OWNER', 'ADMIN'],
          example: 'TENANT',
        },
        status: {
          type: 'boolean',
          example: true,
        },
      },
      required: [
        'full_name',
        'email',
        'password',
        'phone',
        'role',
        'status',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  create(
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.create(dto);
  }

  // ==========================================
  // UPDATE USER
  // ==========================================

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  // ==========================================
  // UPDATE FCM TOKEN
  // ==========================================

  @Patch(':id/fcm-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user FCM token',
  })
  @ApiResponse({
    status: 200,
    description: 'FCM token updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  updateFcmToken(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    return this.userService.updateFcmToken(
      id,
      dto.fcm_token,
    );
  }

  // ==========================================
  // DELETE USER
  // ==========================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.remove(id);
  }

  // ==========================================
  // UPLOAD AVATAR
  // ==========================================

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Upload user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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

  // ==========================================
  // UPDATE AVATAR
  // ==========================================

  @Patch(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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

  // ==========================================
  // DELETE AVATAR
  // ==========================================

  @Delete(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete user avatar',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  removeAvatar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.removeAvatar(id);
  }
}