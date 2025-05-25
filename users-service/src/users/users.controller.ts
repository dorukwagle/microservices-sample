import {
  Controller,
  Get, Body,
  Patch,
  Param,
  UsePipes,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserValidationPipe } from './pipes/query-user.pipe';
import { from } from 'rxjs';
import { UpdateUserValidationPipe } from './pipes/update-user.pipe';
import { Session } from '@common/decorators/session.decorator';
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from '@common/dto/user-response.dto';
import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import Sessions from '@common/entities/sessions';
import UserRole from '@common/entities/user-role';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('me')
  me(@Session() session: Sessions) {
    return from(this.usersService.findOne(session.userId));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get All Users', description: 'Pagination of users. Requires ADMIN role'})
  @ApiOkResponse({ type: PaginationResponseDto<UserResponseDto> })
  @Roles(UserRole.ADMIN)
  @Get()
  @UsePipes(QueryUserValidationPipe)
  findAll(@Query() query: QueryUserDto) {
    return from(this.usersService.findAll(query));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get a user by id', description: 'Requires ADMIN role' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return from(this.usersService.findOne(id));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @Patch()
  update(
    @Session() session: Sessions,
    @Body(UpdateUserValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return from(this.usersService.update(session.userId, updateUserDto));
  }

  // @ApiCookieAuth()
  // @ApiOperation({ summary: 'Disable a user', description: 'Requires ADMIN role' })
  // @ApiOkResponse({ example: { message: 'User disabled successfully' } })
  // @Roles(UserRole.ADMIN)
  // @Patch('disable/:id')
  // disable(@Param('id') id: string) {
  //   return from(this.usersService.disable(id));
  // }

  // @ApiCookieAuth()
  // @ApiOperation({ summary: 'Re-enable the user', description: 'If the user is disabled, re-enable it. Requires ADMIN role' })
  // @ApiOkResponse({ example: { message: 'User enabled successfully' } })
  // @Roles(UserRole.ADMIN)
  // @Patch('enable/:id')
  // enable(@Param('id') id: string) {
  //   return from(this.usersService.enable(id));
  // }

  // @ApiCookieAuth()
  // @ApiOperation({ summary: 'Change current user profile picture. Deletes the old images from storage.' })
  // @ApiOkResponse({ example: {message: 'Profile picture changed successfully', profilePicture: 'profile-picture.jpg'} })
  // @Patch('profile-picture')
  // @ImageUpload('profilePicture')
  // changeProfilePicture(@Session() session: Sessions, @UploadedFile() file: Express.Multer.File) {
  //   return from(this.usersService.changeProfilePicture(session.userId, file.filename));
  // }
}
