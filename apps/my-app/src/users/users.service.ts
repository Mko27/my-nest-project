import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './users.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from '../common/dtos';
import { UpdateUserDto } from './dtos';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.status'])
      .orderBy('user.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async create(user: {
    name: string;
    roles: number[];
    passwordHash: string;
    email: string;
  }): Promise<UserEntity> {
    this.logger.log('USER... ');
    const userRoles = await this.rolesService.findByIds(user.roles);
    const userCreatePayload = {
      name: user.name,
      roles: userRoles,
      passwordHash: user.passwordHash,
      email: user.email,
    };
    return this.userRepository.save(userCreatePayload);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }

  async deleteById(id: number): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.roles', 'role')
      .andWhere('role.name = :name', { name: 'user' });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(userEntity);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.roles', 'role')
      .andWhere('role.name = :name', { name: 'user' });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    Object.assign(userEntity, updateUserDto);

    await this.userRepository.save(userEntity);
  }
}
