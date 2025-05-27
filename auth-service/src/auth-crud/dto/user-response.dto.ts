import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AccountStatus, MultiAuth } from 'generated/prisma';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "User's contact number",
    example: '+1234567890',
    required: false,
  })
  contact?: string;

  @ApiProperty({
    description: 'User roles',
    example: [UserRole.USER, UserRole.ADMIN],
  })
  roles: UserRole[];

  @ApiProperty({
    description: 'Whether the email is verified',
    example: true,
    default: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Whether the contact number is verified',
    example: true,
    default: false,
  })
  contactVerified: boolean;

  @ApiProperty({
    description: 'Multi-factor authentication method',
    enum: MultiAuth,
    example: MultiAuth.EMAIL,
    default: MultiAuth.NONE,
  })
  multiAuth: MultiAuth;

  @ApiProperty({
    description: 'Account status',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    description: 'Account creation timestamp',
    type: Date,
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: Date,
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Account deletion timestamp (soft delete)',
    type: Date,
    example: null,
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;
}
