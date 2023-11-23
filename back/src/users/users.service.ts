import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.hash);
    let avatar = process.env.AVATAR;
		if (createUserDto.avatar) { avatar = createUserDto.avatar  };
		try {
			const user = await this.prisma.user.create({
				data: {
					email: createUserDto.email,
					hash,
					avatar,
					id42: '42',
					username: createUserDto.username,
				},
			});
			return user;
			//return this.signToken(user.id, user.username);
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Credentials taken');
			}
			throw error;
		}
  }

  findAll() {
    const users = this.prisma.user.findMany({ });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
			where: { id: id },
		})
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hash = await argon.hash(updateUserDto.hash);
    const updateUser = await this.prisma.user.update({
		  data: { email: updateUserDto.email,
              username: updateUserDto.username,
              avatar: updateUserDto.avatar,
              hash,
              tel: updateUserDto.tel },
		  where: { id: id},
		});
    return updateUser;
  }

  remove(id: number) {
    const deleteUser = this.prisma.user.delete({
		  where: { id: id },
		});
    return deleteUser;
  }
  
}
