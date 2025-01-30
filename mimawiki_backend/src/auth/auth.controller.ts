import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/user/dto/sign-up.dto';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('send-code')
  async sendCode(@Body('email') email: string, @Res() res: Response) {
    const response = await this.emailService.sendVerificationCode(email);
    return res.status(response.status).json(response);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const response = await this.authService.signUp(signUpDto);
    return res.status(response.status).json(response);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    return res.status(response.status).json(response);
  }
}
