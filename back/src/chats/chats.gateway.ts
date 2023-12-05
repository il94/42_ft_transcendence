import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto, UpdateChatDto, MessageDto } from './dto';
import { Body } from '@nestjs/common';

@WebSocketGateway()
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatsService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }

  @SubscribeMessage('newMessage')
  createMessage(@MessageBody() Body: MessageDto) {
    console.log(Body);
    return this.chatsService.create(Body);
  }
}
