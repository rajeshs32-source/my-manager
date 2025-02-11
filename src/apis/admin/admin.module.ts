import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/entity/auth.entity';
import { AuthController } from './auth/authController/auth.controller';
import { AuthService } from './auth/authService/auth.service';
import { VerifyAdminAuthTokenMiddleware } from 'src/middlerwares/verifyAdminAuthToken.middleware';
import { UserService } from 'src/shared/user.service';
import { CommonPasswordService } from 'src/shared/commonPassword.service';
import { UserContextService } from 'src/shared/userContext.service';
import { UserContext, UserContextSchema } from 'src/entity/userContext.entity';
import {
  CommonPassword,
  CommonPasswordSchema,
} from 'src/entity/commonPassword.entity';
import { User, UserSchema } from 'src/entity/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: CommonPassword.name, schema: CommonPasswordSchema },
      { name: UserContext.name, schema: UserContextSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    CommonPasswordService,
    UserContextService,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyAdminAuthTokenMiddleware)
      .exclude('/admin/adminAuth/(.*)', '/admin/forgotPwd/(.*)')
      .forRoutes('/admin');
  }
}
