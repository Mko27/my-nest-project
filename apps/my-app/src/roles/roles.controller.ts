import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
// import { JwtAuthGuard } from '../common/guards/auth.guard';
import { PageDto, PageOptionsDto } from '../common/dtos';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleDto } from './dtos';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RoleEntity from './roles.entity';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoleEntity>> {
    return this.rolesService.findAll(pageOptionsDto);
  }

  @Get(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Return role.' })
  async findById(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoleEntity>> {
    return this.rolesService.findAll(pageOptionsDto);
  }

  @Post()
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Create role.' })
  async create(@Body() role: RoleDto): Promise<RoleEntity> {
    return this.rolesService.create(role);
  }

  @Patch(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 200, description: 'Update role.' })
  async update(@Param('id') id: number, @Body() role: RoleDto): Promise<void> {
    return this.rolesService.updateRole(id, role);
  }

  @Delete(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 204, description: 'Delete role.' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.rolesService.deleteById(id);
  }
}
