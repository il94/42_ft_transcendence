import { PartialType } from '@nestjs/mapped-types';
import { Channel, ChannelStatus, Invitation, UsersOnChannels, Message, Role } from "@prisma/client"
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChannelDto implements Channel {

	@IsString()
	@IsNotEmpty()
	@MaxLength(8)
	name: string;

	@IsEnum(ChannelStatus)
	@IsNotEmpty()
	type: ChannelStatus;

	avatar: string;
	
	@IsOptional()
	@IsString()
	hash: string;
}

export class UpdateChannelDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(8)
	name: string;

	@IsOptional()
	@IsEnum(ChannelStatus)
	@IsNotEmpty()
	type: ChannelStatus;

	avatar: string;

	@IsOptional()
	@IsString()
	hash: string;
}

export class UpdateRoleDto extends PartialType(CreateChannelDto) {
	@IsEnum(Role)
	role:	Role;
}

export class AuthChannelDto extends PartialType(CreateChannelDto) {

	@IsString()
	@IsOptional()
	hash:	string;
	
}
