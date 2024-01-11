import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { UsersService } from './services/users.service';
import { PrismaModule } from "src/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategy';
import { Api42Strategy } from "./strategy/api42.strategy";
import { SessionSerializer } from "./Serializer";
import { UsersController } from "./controllers/users.controller";
import { Api42AuthGuard, JwtGuard } from "./guards/auth.guard";
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from "@nestjs/axios";

@Module ({
	imports: [
		PrismaModule,
		JwtModule.registerAsync({
			useFactory: async () => ({
			  secret: process.env.JWT_SECRET,
			  signOptions: { expiresIn: '1h' },
			}),
		}),
		PassportModule.register({ defaultStrategy: '42' }),
		HttpModule,
	],
	providers: [JwtStrategy, 
		Api42Strategy,
		//LocalStrategy,
		AuthService, 
		UsersService, 
		SessionSerializer, 
		Api42AuthGuard,
		JwtGuard,
		//{	provide: APP_GUARD,
		//	useClass: JwtGuard, },
	],
		
	controllers: [AuthController, UsersController],
	exports: [AuthService, UsersService],
})

export class AuthModule {}
