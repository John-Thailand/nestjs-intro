import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  // 複数のガードも許容するため CanActivate[]となる
  // @UseGuards(FirstGuard, SecondGuard)
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    // []を使うことで AuthType.Bearer(='bearer')という変数値をキーとして使える
    // { bearer: 'value' }
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    // 指定したメタデータキーを元に値を取得する
    // 第二引数：メタデータを探す順序付きの対象
    // context.getHandler()：該当のメソッド
    // context.getClass()：該当のクラス
    // メソッドに記載された@SetMetadataを優先する
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // array orf guards
    // flat：ネストされた配列を１つの配列にまとめる
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default error
    const error = new UnauthorizedException();

    // loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error: err;
      });
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
