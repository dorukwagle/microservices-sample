import AccountStatus from '@common/entities/account-status';
import UserRole from '@common/entities/user-role';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'd9a6fa9c-7a9c-4a7a-9bae-9c4e0f71f1cf',
  })
  userId: string;

  @ApiProperty({
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    required: false,
    example: '+1234567890',
  })
  contact?: string;

  @ApiProperty({
    examples: [[UserRole.USER], [UserRole.ADMIN, UserRole.USER]],
  })
  roles: UserRole[];

  @ApiProperty({
    required: false,
    examples: ['profile-picture.jpg', null],
  })
  profileImage?: string;

  @ApiProperty({
    example: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
  })
  deletedAt?: Date;
}
