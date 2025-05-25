import { ApiProperty } from '@nestjs/swagger';

export class QueryParamsDto {
  @ApiProperty({
    description: 'Current page number (must be at least 1)',
    minimum: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of items per page (between 1 and 100)',
    minimum: 1,
    maximum: 100,
    required: false,
  })
  pageSize?: number;

  @ApiProperty({
    description: 'Search term for text search',
    required: false,
  })
  seed?: string;

  @ApiProperty({
    description: 'Number filter',
    required: false,
  })
  number?: number;

  @ApiProperty({
    description: 'Status filter (Pending or Completed)',
    enum: ['Pending', 'Completed'],
    required: false,
  })
  status?: 'Pending' | 'Completed';
}
