import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import QueryUserSchema from '../schema/query-user.schema';

export class QueryUserDto extends createZodDto(QueryUserSchema) {
  @ApiProperty({
    example: 1,
    type: 'number',
    description: 'Page number for pagination',
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    example: 10,
    type: 'number',
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
  })
  pageSize: number;

  @ApiProperty({
    example: 'test',
    type: 'string',
    description: 'Search string for users',
  })
  seed: string;
}
