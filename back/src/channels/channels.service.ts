import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/';
import { Channel, User } from '@prisma/client';

// Authenticated user
// Role guard : creator is owner

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(createChannelDto: CreateChannelDto, creator: User) {
    const newChannel = await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        type: createChannelDto.type,
      }
    })
    await this.prisma.channel.update({
      where: { id: newChannel.id },
      data: {
        members: {
          connect: [{ userId_channelId: { userId: creator.id, channelId: newChannel.id } }],
        },
      },
    });
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
