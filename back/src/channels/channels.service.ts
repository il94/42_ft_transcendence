import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/';
import { Channel, User, ChannelStatus } from '@prisma/client';
import * as argon from 'argon2';

// Authenticated user
// Role guard : creator is owner

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(createChannelDto: CreateChannelDto, creator: User) {
    // creating channel
    const newChannel = await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        type: createChannelDto.type,
      }
    })

    // connecting channel-user
    await this.prisma.channel.update({ where: { id: newChannel.id },
      data: {
        members: {
          connect: [{ userId_channelId: { 
            userId: creator.id, 
            channelId: newChannel.id } }],
          },
      },
    });

    // defining user's role in channel
    await this.prisma.channel.update({ where: { id: newChannel.id },
      data: { members: {
        update: { where: { userId_channelId: {
                          userId: creator.id, 
                          channelId: newChannel.id },
                          },
                  data: { role: 'OWNER' }
                }
        }} 
    })

    // setting password
    if (newChannel.type == ChannelStatus.PRIVATE || newChannel.type == ChannelStatus.PROTECTED ) {
      await this.prisma.channel.update({ where: { id: newChannel.id },
        data: { password: await argon.hash(createChannelDto.password) } 
      })
    }

    return newChannel;
  }

  // retrieve all user's channels
  async findUserChannel(member: User) {
    const userChannels = await this.prisma.user.findUnique({
      where: { id: member.id },
      include: { channels: true, }
    })
    return userChannels;
  }

  //retrieve all public channels
  async findAllChannels() {
    const publicChannels = await this.prisma.channel.findMany({
      where: { type: 'PUBLIC' }
    })
    return publicChannels;
  }

  // decorer avec roleguard : le user doit etre owner ou admin 
  // get one channel by id
  async findOneChannel(chanId: number, member: User) {
    const channel = await this.prisma.usersOnChannels.findUnique({ 
      where: { userId_channelId: {
        userId: member.id,
        channelId: chanId }
      }},
    )
    if (!channel)
      throw new NotFoundException(`User with id ${member.id} is not related to channel id ${chanId}`);
    return channel;
  }

  // update a channel, by a user who has edit role
  async updateChannel(updateChannelDto: UpdateChannelDto, member: User) {
    //const chan = this.prisma.channel.findUnique
    try {
      const channel = this.findOneChannel(updateChannelDto.id, member);
      await this.prisma.channel.update({ where: { id: updateChannelDto.id },
        data: { 
          name: updateChannelDto.name,
	        type:       updateChannelDto.type,
	        password:	updateChannelDto.password,
        } 
      })


    } catch (error) {

    }
    
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  /****************************** CRUD USER ON CHANNEL ***********************/



  // ROLE USER : BLOCK, INVITE_PONG, GET_PROFILE, LEAVE, SEND_MESSAGE

  // ROLE ADMIN : BLOCK, LEAVE, KICK, BAN, MUTE /!\ if target is not owner

  // ROLE OWNER : SET_PASSWORD, SET_ADMINS


}
