import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      /// Bearer $token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 어디에서부터 JWT를 추출해줄지 정해줌
      ignoreExpiration: false, // JWT 만료일자를 무시하고 검증할 건지
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'), // 이 시크릿으로 토큰을 검증하면 된다고 정의
    });
  }

  validate(payload: any) {
    return payload;
  }
}
