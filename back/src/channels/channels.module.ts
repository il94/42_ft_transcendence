import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { ChannelController } from './channels.controller';

@Module({
  providers: [ChannelsGateway, ChannelsService],
  controllers: [ChannelController]
})
export class ChatsModule {}
