import { HttpAdapterHost, NestFactory, Reflector,  } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import session from 'express-session';
import passport from 'passport'
import { json } from 'express';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(json({ limit: '5mb' }))
	const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,}));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	
	const { httpAdapter } = app.get(HttpAdapterHost);
  	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	app.use(
		session({
		  secret: 'my-secret',
		  resave: false,
		  saveUninitialized: false,
		  cookie: { maxAge: 60000, }
		}),
	  );

	app.enableCors({
		origin: 'http://localhost:5173'
	})

	app.use(passport.initialize());
	app.use(passport.session());
	
	await app.listen(3333);
}
bootstrap();
