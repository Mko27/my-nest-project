import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './users.entity';
import { UsersController } from './users.controller';
import { RmqModule } from 'infra/microservices/amqp/rmq.module';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import RoleEntity from '../roles/roles.entity';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from '../../../my-nest-project/src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    RolesModule,
    RmqModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
})
export class UsersModule {}
