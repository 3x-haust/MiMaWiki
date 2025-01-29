import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SignUpDto } from 'src/user/dto/sign-up.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, nickname, code } = signUpDto;

    if (!email.endsWith('@e-mirim.hs.kr')) {
      throw new BadRequestException('이메일 도메인이 유효하지 않습니다.');
    }

    const isValidCode = await this.emailService.verifyCode(email, code);
    if (!isValidCode) throw new BadRequestException('잘못된 인증 코드입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      isVerified: true,
    });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('존재하지 않는 이메일입니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
