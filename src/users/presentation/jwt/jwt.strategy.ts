import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../application/service/users.service';
import { JwtPayload } from '../../application/dto/jwt-payload';
import { Injectable } from '@nestjs/common';
import { ReadUserResponse } from '../../application/dto/response/read-user.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<ReadUserResponse> {
    return await this.usersService.findByJwtPayload(payload);
  }
}
