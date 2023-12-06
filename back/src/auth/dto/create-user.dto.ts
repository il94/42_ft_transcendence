import { User, UserStatus } from "@prisma/client"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, 
	IsMobilePhone, IsOptional, MaxLength, MinLength
 } from "class-validator";

export class CreateUserDto implements User {
	
	id: number;

	createdAt: Date;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	@ApiProperty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	@ApiProperty()
	hash: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	avatar: string;

	@IsMobilePhone()
	@IsOptional()
	@ApiProperty()
	tel: string;

	status: UserStatus;
}
