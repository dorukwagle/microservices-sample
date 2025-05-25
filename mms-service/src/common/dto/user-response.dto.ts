import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AccountStatus } from '@prisma/client';


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
  phone?: string;

  @ApiProperty({
    examples: [[UserRole.USER], [UserRole.ADMIN, UserRole.USER]],
  })
  roles: UserRole[];

  @ApiProperty({
    required: false,
    examples: ['profile-picture.jpg', null],
  })
  profilePicture?: string;


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
