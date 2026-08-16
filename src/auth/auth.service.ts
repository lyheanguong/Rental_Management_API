import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,

      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync(refreshToken);

      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
        },
        {
          expiresIn: '15m',
        },
      );

      return {
        accessToken,
      };
    } catch {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }
  }
}