import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { UsersService } from './services/users.service';
import { PrismaModule } from "src/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, Api42Strategy } from './strategy';
import { SessionSerializer } from "./Serializer";
import { UsersController } from "./controllers/users.controller";
import { Api42AuthGuard, JwtGuard } from "./guards/auth.guard";
import { HttpModule } from "@nestjs/axios";
import { AppGateway } from "src/app.gateway";

@Module ({
	imports: [
		PrismaModule,
		JwtModule.registerAsync({
			useFactory: async () => ({
			  secret: process.env.JWT_SECRET,
			  signOptions: { expiresIn: '1d' },
			}),
		}),
		PassportModule.register({ defaultStrategy: '42' }),
		HttpModule
	],
	providers: [JwtStrategy, 
		Api42Strategy,
		AuthService, 
		UsersService, 
		SessionSerializer, 
		Api42AuthGuard,
		JwtGuard,
		AppGateway
	],
		
	controllers: [AuthController, UsersController],
	exports: [AuthService, UsersService],
})

export class AuthModule {}
