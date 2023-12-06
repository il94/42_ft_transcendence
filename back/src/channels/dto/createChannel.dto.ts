
import { Channel, Type, Invitation, UsersOnChannels, Message } from "@prisma/client"

export class CreateChannelDto implements Channel {

	id:          number;
	createdAt:   Date;
	name:        string;
	type:        Type;
	invitation:  Invitation[];
  
	members:     UsersOnChannels[];
	content:     Message[];
	
  }
