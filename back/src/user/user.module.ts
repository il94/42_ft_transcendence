import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
		PrismaModule,
		UserModule,
		JwtModule.register({
		//	global: true,
		//	secret: jwtConstants.secret,
		//	signOptions: { expiresIn: '60s' }
		}),
	], 
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
