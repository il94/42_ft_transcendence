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
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
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
	@IsNotEmpty()
	@MaxLength(8)
	@IsAlpha()
	@IsLowercase()
	username: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@ContainsUppercase()
	@ContainsLowercase()
	@ContainsNumber()
	@ContainsSpecialCharacter()
	hash: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	avatar: string;
	
	@IsOptional()
	@IsBoolean()
	twoFA: boolean;

	@IsOptional()
	@IsString()
	status: UserStatus;

}
