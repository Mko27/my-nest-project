import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dtos';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registration.' })
  async registration(@Body() userData: RegistrationDto) {
    await this.authService.userRegistration(userData);
    return { message: 'Created' };
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User login.' })
  async login(@Body() userData: LoginDto) {
    return this.authService.userLogin(userData);
  }
}
