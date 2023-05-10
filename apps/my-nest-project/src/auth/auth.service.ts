import { Inject, Injectable } from '@nestjs/common';
import { Observable, lastValueFrom, tap } from 'rxjs';
import { RegistrationDto } from './dtos/registration.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('USER') private userClient: ClientProxy) {}

  async userRegistration(payload: RegistrationDto): Promise<{
    name: string;
    email: string;
  }> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash: string = await bcrypt.hash(payload.password, salt);

    const userPayload = {
      name: payload.name,
      passwordHash,
      email: payload.email,
      roles: payload.roleIds,
    };
    await lastValueFrom(
      this.userClient
        .emit('create_user', {
          userPayload,
        })
        .pipe(
          tap((response: any) => {
            console.log(response);
          }),
        ),
    );

    return {
      name: userPayload.name,
      email: userPayload.email,
    };
  }

  async userLogin(payload: LoginDto): Promise<{
    accessToken: string;
  }> {
    // const user = await this.userService.findByEmail(payload.email);

    // if (!user) {
    //   throw new NotFoundException('User with that email not found');
    // }

    // const isEqualPasswords = await bcrypt.compare(
    //   payload.password,
    //   user.passwordHash,
    // );

    // if (!isEqualPasswords) {
    //   throw new ForbiddenException('Wrong password');
    // }

    // const jwtPayload = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   roles: user.roles,
    //   status: user.status,
    // };

    // const accessToken = this.jwtService.sign(jwtPayload);

    return {
      accessToken: '',
    };
  }
}
