import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { from } from 'rxjs';
import { AuthCrudService } from './auth-crud.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateAuthValidationPipe } from './pipes/create-auth.pipe';

@ApiTags('Registration & Updates')
@Controller()
export class AuthCrudController {
  constructor(private readonly authCrudService: AuthCrudService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({
    description: 'When username, email or phone is already taken',
    example: { username: 'Username is already taken' },
  })
  @ApiBadRequestResponse({ description: 'Data validation errors' })
  @Public()
  @Post('register')
  create(@Body(CreateAuthValidationPipe) createUserDto: CreateAuthDto) {
    return from(this.authCrudService.create(createUserDto));
  }

  
}
