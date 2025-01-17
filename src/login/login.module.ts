import { Module } from '@nestjs/common';
import { LoginController } from './loginController/login.controller';
import { LoginService } from './loginService/login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
