import { PartialType } from '@nestjs/mapped-types';
import { Channel, ChannelStatus, Invitation, UsersOnChannels, Message } from "@prisma/client"
import { IsString } from 'class-validator';

export class CreateChannelDto implements Channel {

	id:         number;
	createdAt:  Date;

	@IsString()
	name:       string;

	@IsString()
	type:       ChannelStatus;

	password:	string;
	
	@IsString()
	avatar:		string;
	invitation: Invitation[];
  
	members:    UsersOnChannels[];
	content:    Message[];
	
  }

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id: number;
}
