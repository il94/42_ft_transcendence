import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { ChannelController } from './channels.controller';
import { AppService } from 'src/app.service';
import { PongGateway } from 'src/pong/pong.gateway';
import { PongService } from 'src/pong/pong.service';
import { UsersService } from 'src/auth/services/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/app.gateway';
import { PongModule } from 'src/pong/pong.module';


@Module({
  imports: [PongModule],
  providers: [
    ChannelsGateway,
    ChannelsService,
    AppService,
  ],
  controllers: [ChannelController]
})
export class ChatsModule {}