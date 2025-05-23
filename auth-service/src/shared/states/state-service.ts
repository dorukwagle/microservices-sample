import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { ExpiredOrInvalidStateTokenException } from '@common/exceptions/invalid-token.exception';

// Promisify jwt functions
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@Injectable()
export class StateService {
  private readonly secret = process.env.SIGNING_SECRET ||randomBytes(32).toString('hex')
  private readonly options = {
    expiresIn: '1m',
    algorithm: 'HS256' as jwt.Algorithm,
  };

  async generateStateToken(payload: any, expiresIn?: string): Promise<string> {
    return signAsync(payload, this.secret, expiresIn ? { ...this.options, expiresIn } : this.options);
  }

  async verifyStateToken(token: string): Promise<any> {
    try {
      return verifyAsync(token, this.secret, this.options);
    } catch (error) {
      throw new ExpiredOrInvalidStateTokenException();
    }
  }

  async setStateValue<T>(
    token: string,
    key: string,
    value: T,
  ): Promise<string> {
    try {
      const decoded = (await verifyAsync(token, this.secret)) as {
        [key: string]: any;
      };
      decoded[key] = value;
      return signAsync(decoded, this.secret, this.options);
    } catch (error) {
      throw new ExpiredOrInvalidStateTokenException();
    }
  }
}
