import { Prisma, PrismaClient } from '@prisma/client';
import { DEFAULT_PAGE_SIZE } from '@common/entities/constant';
import { QueryParamsDto } from '@common/dto/query-params.dto';
import QueryParamsSchema from '@common/schema/query-params.schema';
import { PaginationResponseDto } from '@common/dto/pagination-response.dto';

type producer = <U>(args: U) => Promise<U>;

class Paginator<T> {
  private model: Uncapitalize<Prisma.ModelName>;
  private args: T;
  private params?: QueryParamsDto;
  private prismaClient: PrismaClient;
  private query = {};
  private where = {};
  private page = 1;
  private pageSize = 1;
  private data: any = [];
  private applyProducer: producer | null = null;

  constructor(
    prismaClient: PrismaClient,
    model: Uncapitalize<Prisma.ModelName>,
    args: T,
    params?: QueryParamsDto,
  ) {
    this.prismaClient = prismaClient;
    this.model = model;
    this.args = args;
    this.params = params;

    const validation = QueryParamsSchema.pick({
      page: true,
      pageSize: true,
    }).safeParse(params).data;
    this.page = validation?.page || 1;
    this.pageSize = validation?.pageSize || DEFAULT_PAGE_SIZE;

    this.where = (args as any).where;
    this.query = {
      ...args,
      take: this.pageSize,
      skip: (this.page - 1) * this.pageSize,
    };
  }

  get = async () => {
    // @ts-ignore
    const count = await this.prismaClient[this.model].count({
      where: this.where,
    });

    // @ts-ignore
    this.data = await this.prismaClient[this.model].findMany(this.query);
    if (this.applyProducer) this.data = await this.applyProducer(this.data);

    return {
      data: this.data,
      statusCode: 200,
      info: {
        total: count,
        lastPage: Math.ceil(count / this.pageSize),
        prev: this.page > 1 ? this.page - 1 : null,
        next:
          this.page < Math.ceil(count / this.pageSize) ? this.page + 1 : null,
      },
    } as PaginationResponseDto<any>;
  };

  apply = (fun: producer): Paginator<T> => {
    this.applyProducer = fun;
    return this;
  };
}

export default Paginator;
