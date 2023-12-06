import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './createChannel.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id: number;
}
