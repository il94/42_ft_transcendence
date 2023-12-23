import { User, UserStatus } from "@prisma/client"
import { ApiProperty, PartialType } from '@nestjs/swagger';
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

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	@ApiProperty()
	hash: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsMobilePhone()
	@IsOptional()
	@ApiProperty()
	phoneNumber: string;

	twoFA: boolean;

	@IsString()
	@IsOptional()
	@ApiProperty()
	avatar: string;

	status: UserStatus;

	wins: number;
	draws: number;
	losses: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {

	@IsString()
	@ApiProperty()
	username: string;

	@IsString()
	@ApiProperty()
	hash: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@IsMobilePhone()
	@ApiProperty()
	phoneNumber: string;

	@IsString()
	@ApiProperty()
	avatar: string;

}
