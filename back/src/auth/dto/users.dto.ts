import { User, UserStatus } from "@prisma/client"
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, 
	IsMobilePhone, IsOptional, MaxLength, MinLength, IsBoolean
 } from "class-validator";

export class CreateUserDto implements User {
	
	id: number;

	createdAt: Date;

	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	@ApiProperty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	@ApiProperty()
	hash: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	avatar: string;

	@IsMobilePhone()
	@IsOptional()
	@ApiProperty()
	phoneNumber: string;

	twoFA: boolean;
	twoFASecret: string; 
	status: UserStatus;
	wins: number;
	draws: number;
	losses: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {

	@IsOptional()
	@IsString()
	@ApiProperty()
	username: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	hash: string;

	@IsOptional()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsOptional()
	@IsMobilePhone()
	@ApiProperty()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	avatar: string;

	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	twoFA: boolean;

}
