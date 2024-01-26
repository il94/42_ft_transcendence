import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { ChannelController } from './channels.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [
    ChannelsGateway,
    ChannelsService,
    AppService
  ],
  controllers: [ChannelController]
})
export class ChatsModule {}
