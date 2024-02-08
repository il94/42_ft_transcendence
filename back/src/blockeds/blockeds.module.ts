import { Module } from '@nestjs/common';
import { BlockedsService } from './blockeds.service';
import { BlockedsController } from './blockeds.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelsService } from 'src/channels/channels.service';

@Module({
  imports: [ PrismaModule ],
  controllers: [BlockedsController],
  providers: [BlockedsService,
				ChannelsService],
  exports: [ BlockedsService ]
})
export class BlockedsModule {}
