import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/';
import { Channel, User, ChannelStatus } from '@prisma/client';
import * as argon from 'argon2';
import { getEventListeners } from 'events';

// Authenticated user
// Role guard : creator is owner

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(createChannelDto: CreateChannelDto, creator: User) {
    console.log("creator :", creator);
    const newChannel = await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        avatar: createChannelDto.avatar,
        type: createChannelDto.type,
        members: { 
          create: [
            {
              role: 'OWNER',
              user: {connect: { id: creator.id }}
            }
          ]  
        },
      }
    })
    // setting password
    if (newChannel.type == ChannelStatus.PRIVATE || newChannel.type == ChannelStatus.PROTECTED )
    {
      await this.prisma.channel.update({ where: { id: newChannel.id },
        data: { password: await argon.hash(createChannelDto.password) } 
      })
    }
    console.log("new channel ", newChannel);
    return newChannel;
  }

  async addUserChannel(friendId: number, member: User) {
    try {
 
    } catch (error) { }   
  }

  //retrieve all public channels
  async findAllChannels() {
    const publicChannels = await this.prisma.channel.findMany({
     where: { type: 'PUBLIC' || 'PROTECTED' },
    })
    if (publicChannels)
      console.log("YES");
    return publicChannels;
  }

  // 
  async findChannel(chanId: number) {
    const channel = await this.prisma.channel.findUnique({ 
      where: { id: chanId }},
    )
    if (!channel)
      throw new NotFoundException(`User with id ${chanId} is not related to channel id ${chanId}`);
    return channel;
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
      const channel = await this.prisma.channel.update({ where: { id: updateChannelDto.id },
        data: { 
          name: updateChannelDto.name,
	        type:       updateChannelDto.type,
	        password:	updateChannelDto.password,
        } 
      })
    } catch (error) { }    
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  /****************************** CRUD USER ON CHANNEL ***********************/



  // ROLE USER : BLOCK, INVITE_PONG, GET_PROFILE, LEAVE, SEND_MESSAGE

  // ROLE ADMIN : BLOCK, LEAVE, KICK, BAN, MUTE /!\ if target is not owner

  // ROLE OWNER : SET_PASSWORD, SET_ADMINS


}
