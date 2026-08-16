import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // =========================
  // Internal Methods
  // =========================

  private async findUserOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }

  // =========================
  // CRUD Methods
  // =========================

  async findAll() {
    const users = await this.userRepository.find();

    return {
      success: true,
      message: 'Users retrieved successfully.',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.findUserOrFail(id);

    return {
      success: true,
      message: 'User retrieved successfully.',
      data: user,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const exist = await this.findByEmail(createUserDto.email);

    if (exist) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return {
      success: true,
      message: 'User created successfully.',
      data: savedUser,
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.findUserOrFail(id);

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);

    return {
      success: true,
      message: 'User updated successfully.',
      data: updatedUser,
    };
  }

  async remove(id: number) {
    const user = await this.findUserOrFail(id);

    await this.userRepository.remove(user);

    return {
      success: true,
      message: 'User deleted successfully.',
    };
  }

  async uploadAvatar(
    id: number,
    filename: string,
  ) {
    const user = await this.findUserOrFail(id);

    user.avatar = `/uploads/avatars/${filename}`;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Avatar uploaded successfully.',
      data: user.avatar,
    };
  }

  async updateAvatar(
    id: number,
    filename: string,
  ) {
    const user = await this.findUserOrFail(id);

    // Delete old image
    if (user.avatar) {
      const oldImage = path.join(
        process.cwd(),
        user.avatar.replace('/uploads/', 'uploads/'),
      );

      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }
    }

    user.avatar = `/uploads/avatars/${filename}`;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Avatar updated successfully.',
      data: user.avatar,
    };
  }

  async removeAvatar(id: number) {
    const user = await this.findUserOrFail(id);

    if (user.avatar) {
      const oldImage = path.join(
        process.cwd(),
        user.avatar.replace('/uploads/', 'uploads/'),
      );

      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }
    }

    user.avatar = null;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Avatar removed successfully.',
    };
  }
}