import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './my-app.module';
import * as dotenv from 'dotenv';
import { RmqService } from 'infra/microservices/amqp/rmq.service';

async function bootstrap() {
  dotenv.config();
  console.log(process.env.PORT);
  const app = await NestFactory.create(MyAppModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('USER'));
  await app.startAllMicroservices();
}
bootstrap();
