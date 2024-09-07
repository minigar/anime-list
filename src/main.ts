import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const configService = app.get(ConfigService);

  const port = configService.get<number>('APP_PORT', 3001);

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60, // 1 hour
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`Server has been started at ${port} port!`);
}

bootstrap();
