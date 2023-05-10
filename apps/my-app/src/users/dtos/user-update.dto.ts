import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../common/constants';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserStatus, { message: 'Invalid status provided' })
  status: UserStatus;
}
