import { HttpAdapterHost, NestFactory, Reflector,  } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import session from 'express-session';
import passport from 'passport'
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';

async function bootstrap() {
	const httpsOptions: HttpsOptions = {
		key: fs.readFileSync('./secrets/private.key'),
		cert: fs.readFileSync('./secrets/public-certificate.crt'),
	  };
	const app = await NestFactory.create(AppModule, { httpsOptions });
	app.use(json({ limit: '5mb' }))
	
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,}));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	
	const { httpAdapter } = app.get(HttpAdapterHost);
  	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	app.use(
		session({
		  secret: process.env.SESSION_SECRET,
		  resave: false,
		  saveUninitialized: false,
		  cookie: { maxAge: 60000, }
		}),
	  );
	  
	app.enableCors({
		origin: '*',
		credentials: true,
	})

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());
	
	await app.listen(process.env.PORT);
}
bootstrap();
