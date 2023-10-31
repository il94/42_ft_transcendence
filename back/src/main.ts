import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//	app.enableCors({
//		origin: 'http://localhost:5173'
//	})
	await app.listen(3333);
}
bootstrap();
