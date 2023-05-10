import { Controller, Get } from '@nestjs/common';
import { MyAppService } from './my-app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
@Controller()
export class MyAppController {
  constructor(private readonly myAppService: MyAppService) {}

  @EventPattern('subject')
  getHello(@Payload() payload): string {
    return this.myAppService.getHello();
  }
}
