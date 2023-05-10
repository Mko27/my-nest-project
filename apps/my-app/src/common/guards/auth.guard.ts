import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserStatus } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const bearerToken = req.headers.authorization.replace('Bearer ', '');

    if (!bearerToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(bearerToken);

      if (payload.status === UserStatus.BLOCKED) {
        throw new UnauthorizedException('You is blocked');
      }

      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (
        requiredRoles &&
        payload.roles &&
        !payload.roles.some((role) => requiredRoles.includes(role.name))
      ) {
        throw new UnauthorizedException(
          'You do not have permission to access this resource',
        );
      }

      req.user = payload;

      return true;
    } catch (e) {
      throw new UnauthorizedException(e.status);
    }
  }
}
