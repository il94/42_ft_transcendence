import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { getUser } from '../decorators/users.decorator'
import { User } from '@prisma/client';

// @UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@getUser() user: User) {
    console.log(user);
    return user;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findById(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.updateUser(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

}

