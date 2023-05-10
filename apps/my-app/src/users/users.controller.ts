import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { JwtAuthGuard } from '../common/guards/auth.guard';
import { PageDto, PageOptionsDto } from '../common/dtos';
// import { Roles } from '../common/decorators/roles.decorator';
// import { UserRole } from '../common/constants';
import { UpdateUserDto } from './dtos';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import UserEntity from './users.entity';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'infra/microservices/amqp/rmq.service';

@Controller('users')
@ApiTags('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('create_user')
  async handleCreatedUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const result = await this.usersService.create(data.userPayload);
    this.rmqService.ack(context);
    return { success: true, data: result };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Return user by id.' })
  async findById(@Param('id') id: number) {
    const user = this.usersService.findById(id);

    return user;
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 204, description: 'Delete user by id.' })
  async deleteById(@Param('id') id: number) {
    await this.usersService.deleteById(id);
  }

  @Patch(':id')
  // @Roles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 200, description: 'Update user by id.' })
  async updateById(
    @Param('id') id: number,
    @Body() updatePostDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updatePostDto);
  }
}
