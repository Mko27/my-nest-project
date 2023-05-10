import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dtos';
import { ApiResponse } from '@nestjs/swagger';
import {
  AmqpClient,
  PublishInQueueArgs,
} from '../../infra/microservices/amqp/amqp-client.connection';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private amqpClient: AmqpClient,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registration.' })
  async registration(@Body() userData: RegistrationDto) {
    const registeredUser = await this.authService.userRegistration(userData);

    const queue = 'test';
    const message = JSON.stringify(registeredUser);
    const connection = await this.amqpClient.start();
    const args: PublishInQueueArgs = { queue, message, connection };
    await this.amqpClient.publishInQueue(args);

    return registeredUser;
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User login.' })
  async login(@Body() userData: LoginDto) {
    return this.authService.userLogin(userData);
  }
}
