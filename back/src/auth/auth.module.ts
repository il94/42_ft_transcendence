import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Prisma } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";

@Module ({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [AuthService],

})

export class AuthModule {}
