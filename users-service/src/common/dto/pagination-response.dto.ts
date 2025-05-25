import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Info {
  @ApiProperty({description: 'Total number of items', example: 100})
  total: number;

  @ApiProperty({description: 'Last page number', example: 10})
  lastPage: number;

  @ApiPropertyOptional({description: 'Next page number', example: 2})
  next: number | null;

  @ApiPropertyOptional({description: 'Previous page number', example: null})
  prev: number | null;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty()
  info: Info;
}