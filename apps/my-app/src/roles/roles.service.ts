import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RoleEntity from './roles.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from '../common/dtos';
import { RoleDto } from './dtos';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoleEntity>> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .select(['role.id', 'role.name'])
      .orderBy('role.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  findByIds(ids: number[]): Promise<RoleEntity[]> {
    return this.roleRepository
      .createQueryBuilder('role')
      .whereInIds(ids)
      .getMany();
  }

  create(role: RoleDto): Promise<RoleEntity> {
    return this.roleRepository.save(role);
  }

  async updateRole(id: number, roleDto: RoleDto): Promise<void> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id });

    const roleEntity = await queryBuilder.getOne();

    if (!roleEntity) {
      throw new NotFoundException('Role not found');
    }

    Object.assign(roleEntity, roleDto);

    await this.roleRepository.save(roleEntity);
  }

  async deleteById(id: number): Promise<void> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id });

    const roleEntity = await queryBuilder.getOne();

    if (!roleEntity) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.remove(roleEntity);
  }
}
