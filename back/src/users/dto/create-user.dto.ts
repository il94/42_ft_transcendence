import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, 
	IsMobilePhone, IsOptional, MaxLength, MinLength
 } from "class-validator";


export class CreateUserDto {
    
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	id42: string;

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
	@MinLength(6)
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
