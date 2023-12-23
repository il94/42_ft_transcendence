import { PartialType } from '@nestjs/mapped-types';
import { Channel, ChannelStatus, Invitation, UsersOnChannels, Message } from "@prisma/client"

export class CreateChannelDto implements Channel {

	id:         number;
	createdAt:  Date;
	name:       string;
	type:       ChannelStatus;
	password:	string;
	invitation: Invitation[];
  
	members:    UsersOnChannels[];
	content:    Message[];
	
  }

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id: number;
}
