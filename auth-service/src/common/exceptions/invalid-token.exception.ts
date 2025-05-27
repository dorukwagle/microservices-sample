import { UnauthorizedException } from '@nestjs/common';

export class ExpiredOrInvalidStateTokenException extends UnauthorizedException {
  constructor() {
    super('Expired or invalid state token.');
  }
}
