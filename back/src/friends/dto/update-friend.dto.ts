import { PartialType } from '@nestjs/swagger';
import { CreateFriendDto } from './create-friend.dto';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {}
