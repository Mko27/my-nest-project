import { Controller, Get /*UseGuards*/ } from '@nestjs/common';
import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/guards/auth.guard';
// import { Roles } from './common/decorators/roles.decorator';
// import { UserRole } from './constants';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  // @Roles(UserRole.USER, UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
