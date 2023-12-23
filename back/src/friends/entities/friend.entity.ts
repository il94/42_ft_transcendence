import { ApiProperty } from '@nestjs/swagger';
import { Friends, RequestStatus } from '@prisma/client';

export class FriendsEntity implements Friends {
	constructor(partial: Partial<FriendsEntity>) {
		Object.assign(this, partial);
	}
	
	@ApiProperty()
	id: number;

	@ApiProperty()
	hasFriendsId: number;

	@ApiProperty()
	isFriendId: number;

	@ApiProperty()
	request: RequestStatus;
}
