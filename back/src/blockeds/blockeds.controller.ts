import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { BlockedsService } from './blockeds.service';
// import { RelationDto } from './dto/blockeds.dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
//import { AuthGuard } from '../auth/guards/auth.guard';
//import { JwtPayload } from 'src/users/constants';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('blockeds')
export class BlockedsController {
  constructor(private readonly blockedsService: BlockedsService) {}

  @Post(':id')
  addNewBlocked(@getUser() user: User,
  @Param('id', ParseIntPipe) id: number) {
      console.log("taget id: ", id);
      return this.blockedsService.addBlocked(user.id, id);
  }

  @Get()
  async getUserBlockeds(@getUser() user: User ) {
    return await this.blockedsService.getUserBlockeds(user.id);
  }

  // @Patch('update/:id')
  // updateRelation(
  //   @Param('id', ParseIntPipe) id: number, 
  //   @Body() dto: RelationDto) {
  //       return this.blockedsService.updateRelation(id, dto);
  //   }

  @Delete(':id')
  async removeBlocked(@getUser() user: User,
  @Param('id', ParseIntPipe) blockedId: number) {
        return this.blockedsService.removeBlocked(user.id, blockedId);
    }
}
