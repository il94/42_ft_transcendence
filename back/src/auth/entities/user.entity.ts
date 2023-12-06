import { ApiProperty } from '@nestjs/swagger';
import { User, UserStatus, Friends, Role, Channel, Game, Message, UsersOnChannels, UsersOnGames } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
	
	@ApiProperty()
	id: number;

	@ApiProperty()
  	createdAt: Date;
	
	@ApiProperty()
	username: string; 
	
	@ApiProperty()
	email: string; 
	
	@Exclude()
	hash: string;
	
	@ApiProperty()
	avatar: string;
	
	@ApiProperty()
	tel: string;

	@ApiProperty()
	status: UserStatus;
}