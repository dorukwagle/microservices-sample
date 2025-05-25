import { z } from 'zod';

const QueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(3, 'Page size must be at least 3').max(100, 'Page size limit is 100').optional(),
  seed: z.string().optional(), // for text search
  number: z.coerce.number().optional(),
});

export default QueryParamsSchema;
