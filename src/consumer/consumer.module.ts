import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entity/user.entity';
import { FeedbackController } from './feedback/feedback.controller';
import { LabourController } from './labour/labour.controller';
import { SalaryController } from './salary/salary.controller';
import { ServiceController } from './service/service.controller';
import { VehicleController } from './vehicle/vehicle.controller';
import { WorkshopSettingsController } from './workshop-settings/workshop-settings.controller';
import { FeedbackService } from './feedback/feedback.service';
import { LabourService } from './labour/labour.service';
import { SalaryService } from './salary/salary.service';
import { ServiceService } from './service/service.service';
import { VehicleService } from './vehicle/vehicle.service';
import { WorkshopSettingsService } from './workshop-settings/workshop-settings.service';
import { UserController } from './user/user.controller';
import { Feedback, FeedbackSchema } from 'src/entity/feedback.entity';
import { Labour, LabourSchema } from 'src/entity/labour.entity';
import { Service, ServiceSchema } from 'src/entity/service.entity';
import { Vehicle, VehicleSchema } from 'src/entity/vehicle.entity';
import { Salary, SalarySchema } from 'src/entity/salary.entity';
import {
  WorkshopSettings,
  WorkshopSettingsSchema,
} from 'src/entity/workshopSettings.entity';
import { VerifyConsumerAuthTokenMiddleware } from 'src/middlerwares/VerifyConsumerAuthTokenMiddleware.middleware';
import { UserContextService } from 'src/shared/userContext.service';
import { UserContext, UserContextSchema } from 'src/entity/userContext.entity';
import { OrderController } from './order/order.controller';
import { OrderService } from './Order/Order.service';
import { UserService } from './user/user.service';
import { Order, OrderSchema } from 'src/entity/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Labour.name, schema: LabourSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Salary.name, schema: SalarySchema },
      { name: WorkshopSettings.name, schema: WorkshopSettingsSchema },
      { name: UserContext.name, schema: UserContextSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [
    UserController,
    OrderController,
    FeedbackController,
    LabourController,
    SalaryController,
    ServiceController,
    VehicleController,
    WorkshopSettingsController,
  ],
  providers: [
    UserService,
    OrderService,
    FeedbackService,
    LabourService,
    SalaryService,
    ServiceService,
    VehicleService,
    WorkshopSettingsService,
    UserContextService,
  ],
})
export class ConsumerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyConsumerAuthTokenMiddleware)
      // .exclude(
      //   'api/consumer/auth/(.*)',
      //   'api/consumer/auth2/(.*)',
      //   'api/consumer/unit/getByBlockId/(.*)',
      //   'api/consumer/customer/(.*)',
      // )
      .forRoutes('/consumer');
  }
}
