import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // transport: どのようにメールを送信するかを定義する箇所
        transport: {
          // ① hostとportを使ってメールサーバーに接続する
          host: config.get('appConfig.mailHost'),
          secure: false,
          port: 2525,
          // ② ユーザー名とパスワードでメールサーバーにログイン認証を行う
          // ③ メールを送信する
          // ④ メールサーバーがそのメールを配送する
          auth: {
            user: config.get('appConfig.smtpUsername'),
            pass: config.get('appConfig.smtpPassword'),
          },
        },
        default: {
          from: `My Blog <no-reply@nestjs-blog.com>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
