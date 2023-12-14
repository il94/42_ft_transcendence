import { PartialType } from '@nestjs/swagger';

export class CreateFriendDto {}

export class UpdateFriendDto extends PartialType(CreateFriendDto) {}
