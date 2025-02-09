import { Controller, HttpStatus, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../authService/auth.service';
import { AuthRequestDto, SignupRequestDto } from 'src/dto/adminRequest.dto';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { AuthValidator } from 'src/validators/authvalidator';
@Controller('auth')
export class AuthController {
  constructor(private _consumerAuthService: AuthService) {}

  @Post('login')
  async login(
    @Res() response: Response,
    @Body() authRequestDto: AuthRequestDto,
  ) {
    // validate auth login
    await AuthValidator.validateLogin(authRequestDto);
    const token = await this._consumerAuthService.login(authRequestDto);

    return response
      .status(HttpStatus.OK)
      .json(new GlobalResponseDto(HttpStatus.OK, '', token, []));
  }

  @Post('signUp')
  async signUp(
    @Res() response: Response,
    @Body() signupRequestDto: SignupRequestDto,
  ) {
    // validate input
    await AuthValidator.validateSignup(signupRequestDto);
    const msg = await this._consumerAuthService.signup(signupRequestDto);

    return response
      .status(HttpStatus.OK)
      .json(new GlobalResponseDto(HttpStatus.OK, '', msg, []));
  }
}
