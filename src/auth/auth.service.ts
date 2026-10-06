
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

  // ==========================================
  // LOGIN
  // ==========================================
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    // Check email and password
    if (!user || user.password !== password) {
      throw new UnauthorizedException(
        'Email or password is incorrect.',
      );
    }

    // Check account status
    if (!user.status) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact the administrator.',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  // ==========================================
  // REFRESH ACCESS TOKEN
  // ==========================================
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is required.',
      );
    }

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
        success: true,
        message: 'Access token refreshed successfully.',
        data: {
          accessToken,
        },
      };
    } catch {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired. Please log in again.',
      );
    }
  }
}
