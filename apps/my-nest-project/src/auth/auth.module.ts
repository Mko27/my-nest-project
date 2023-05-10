import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RmqModule } from 'infra/microservices/amqp/rmq.module';
import { RmqService } from 'infra/microservices/amqp/rmq.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RmqModule.register({
      name: 'USER',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RmqService],
  exports: [],
})
export class AuthModule {}
