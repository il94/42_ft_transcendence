import { PartialType } from '@nestjs/mapped-types';
import { Channel, ChannelStatus, Invitation, UsersOnChannels, Message, Role } from "@prisma/client"
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChannelDto implements Channel {
	id:         number;
	createdAt:  Date;

	@IsOptional()
	@IsString()
	@MaxLength(8)
	name:       string;

	@IsOptional()
	@IsString()
	type:       ChannelStatus;

	@IsOptional()
	@IsString()
	password:	string;
	
	@IsString()
	@IsOptional()
	avatar:		string;

	invitation: Invitation[];
	members:    UsersOnChannels[];
	content:    Message[];
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {

  @IsString()
  @MaxLength(8)
  name:	string;

  @IsString()
  type:	ChannelStatus;

  @IsOptional()
  @IsString()
  password:	string;
  
  @IsString()
  @IsOptional()
  avatar:	string;

  members:	UsersOnChannels[];
  
  content:	Message[];
}

export class UpdateRoleDto extends PartialType(CreateChannelDto) {
	@IsEnum(Role)
	role:	Role;
}

export class AuthChannelDto extends PartialType(CreateChannelDto) {

	@IsString()
	@IsOptional()
	password:	string;
	
}
