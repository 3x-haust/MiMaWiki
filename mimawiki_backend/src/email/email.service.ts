import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async sendVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`verify:${email}`, code, 300);

    await this.mailerService.sendMail({
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: '미마위키 이메일 인증 코드',
      text: `인증 코드: ${code}`,
    });
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.get(`verify:${email}`);
    return storedCode === code;
  }
}
