import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsMobilePhone, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {

	@IsString()
	@ApiProperty()
	username: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@IsString()
	@ApiProperty()
	hash: string;

	@IsString()
	@ApiProperty()
	avatar: string;

	@IsMobilePhone()
	@ApiProperty()
	tel: string;
}
