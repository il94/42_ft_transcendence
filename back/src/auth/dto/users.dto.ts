import { User, UserStatus } from "@prisma/client"
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, 
	IsMobilePhone, IsOptional, MaxLength, MinLength, IsBoolean, IsAlphanumeric, IsLowercase, IsAlpha
 } from "class-validator";
import { ContainsLowercase, ContainsNumber, ContainsSpecialCharacter, ContainsUppercase, IsEmail, IsPhoneNumber } from "../decorators/auth.decorators";

export class CreateUserDto implements User {
	
	id: number;

	createdAt: Date;

	@IsString()
	@IsNotEmpty()
	@MaxLength(8)
	@IsAlpha()
	@IsLowercase()
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@ContainsUppercase()
	@ContainsLowercase()
	@ContainsNumber()
	@ContainsSpecialCharacter()
	hash: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	@ApiProperty()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	avatar: string;

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
	@IsString()
	@ApiProperty()
	status: UserStatus;

	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	twoFA: boolean;

}
