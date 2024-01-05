import { Channel, ChannelStatus, Invitation, UsersOnChannels, Message } from "@prisma/client"

export class ChannelEntity implements Channel {
	constructor(partial: Partial<ChannelEntity>) {
		Object.assign(this, partial);
	}

	id:			number;
	createdAt:	Date;
	name:       string;
	avatar:		string;
	type:       ChannelStatus;
	password:	string;
	invitation: Invitation[];
  
	members:    UsersOnChannels[];
	content:    Message[];
	
  }
