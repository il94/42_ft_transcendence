import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TwoFaDto {

	@IsNotEmpty()
    @IsString()
	value: string;

    @IsBoolean()
    error: boolean;
}