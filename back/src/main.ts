import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,}));
	app.setGlobalPrefix('api');
	app.use(
		session({
		  secret: 'my-secret',
		  resave: false,
		  saveUninitialized: false,
		  cookie: { maxAge: 60000, }
		}),
	  );
//	app.enableCors({
//		origin: 'http://localhost:5173'
//	})
app.use(passport.initialize());
app.use(passport.session());
	await app.listen(3333);
}
bootstrap();

;
// somewhere in your initialization file
