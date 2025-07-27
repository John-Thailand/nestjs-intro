import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  // ExecutionContext: 現在のリクエストやハンドラの情報を持つオブジェクト
  // const request = context.switchToHttp().getRequest();
  // CallHandler: 次に処理されるメソッドをラップするオブジェクト
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    // handle()を実行することで、レスポンスを返す処理が始まる
    // pipe()で後処理（レスポンス加工、ログ出力など）を追加できる
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get('appConfig.apiVersion'),
        data: data,
      })),
    );
  }
}
