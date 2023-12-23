import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';

@Module({
  providers: [ChannelsGateway, ChannelsService],
})
export class ChatsModule {}
