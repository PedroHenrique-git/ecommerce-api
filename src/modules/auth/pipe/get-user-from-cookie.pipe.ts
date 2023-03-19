import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../protocols/auth-user.interface';

@Injectable()
export class GetUserFromCookie implements PipeTransform<string, AuthUser> {
  constructor(private jwtService: JwtService) {}

  transform(value: string): AuthUser {
    const { exp, iat, ...user } = this.jwtService.decode(value) as Record<
      string,
      unknown
    >;

    return user as unknown as AuthUser;
  }
}
