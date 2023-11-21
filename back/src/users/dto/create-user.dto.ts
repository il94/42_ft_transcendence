import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsMobilePhone, IsOptional } from "class-validator";

export class CreateUserDto {

	@ApiProperty()
	title: string;
    
	// @ApiProperty({ required: false, default: false })
	// published?: boolean = false;

	//@IsNotEmpty()
	@IsString()
	@ApiProperty({ required: false })
	id42?: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsOptional()
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
}
