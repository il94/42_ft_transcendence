import { Module } from '@nestjs/common';
import { BlockedsService } from './blockeds.service';
import { BlockedsController } from './blockeds.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ PrismaModule ],
  controllers: [BlockedsController],
  providers: [BlockedsService],
  exports: [ BlockedsService ]
})
export class BlockedsModule {}
