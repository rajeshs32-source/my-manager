import { AppModule } from './app.module';
import helmet from 'helmet';
import { config } from './config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ExceptionsFilter } from './filters/exception.filter';
import { ConfigService } from './shared/config.service';

async function bootstrap() {
  ConfigService.setEnvironment(
    config.ENVIRONMENT,
    config.LOG_GROUP_NAME,
    config.LOG_STREAM_NAME,
  );

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(helmet());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  const PORT = parseInt(process.env.PORT) || 6002;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
  });
}
bootstrap();
