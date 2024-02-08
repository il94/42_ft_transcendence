import { Module } from '@nestjs/common';
import { BlockedsService } from './blockeds.service';
import { BlockedsController } from './blockeds.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelsService } from 'src/channels/channels.service';
import { PongModule } from 'src/pong/pong.module';

@Module({
  imports: [ PrismaModule, PongModule],
  controllers: [BlockedsController],
  providers: [BlockedsService,
				ChannelsService],
  exports: [ BlockedsService ]
})
export class BlockedsModule {}
