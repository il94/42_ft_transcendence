import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ PrismaModule ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [ FriendsService ]
})
export class FriendsModule {}
