import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
// ExpressのHTTPリクエストオブジェクトを使うため
// NestJSはデフォルトでHTTP通信の基盤としてExpressを使用しています
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // JWTに関する設定値をconstructor経由で依存注入している
    // ConfigTypeはregisterAsで定義した設定オブジェクトの型を安全に取得するためのもの
    // @Inject(jwtConfig)で設定を注入している
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from the execution context
    const request = context.switchToHttp().getRequest();
    // Extract the token from header
    const token = this.extractRequestFromHeader(request);
    // validate the token
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // 与えられたJWTトークンが正しいかチェックし、正しければその中身を取り出す
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
      console.log(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
