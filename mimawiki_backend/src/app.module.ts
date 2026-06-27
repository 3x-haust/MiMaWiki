import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { WikiModule } from './wiki/wiki.module';
import { readDatabaseConnectionSettings } from './config/database-env';

const databaseConnectionSettings =
  readDatabaseConnectionSettings(process.env);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...databaseConnectionSettings,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            type: 'login',
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
      }),
    }),
    UserModule,
    AuthModule,
    WikiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
