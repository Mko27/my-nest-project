import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';
import { EqualToProperty } from '../../utils/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ArrayMinSize(1)
  roleIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @EqualToProperty('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
