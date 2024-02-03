import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class TwoFaDto {

	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	@Length(6, 6)
	twoFACode: string;

}