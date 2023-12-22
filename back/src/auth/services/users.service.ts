import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, Friends, RequestStatus, Invitation } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const userExists = await this.prisma.user.findUnique({
				where: { email: createUserDto.email },
			})
			if (userExists)
				throw new BadRequestException("User already exists");
			const hash = await argon.hash(createUserDto.hash);
			let avatar = process.env.AVATAR;
			if (createUserDto.avatar) { avatar = createUserDto.avatar };
			const user = await this.prisma.user.create({
				data: {
					email: createUserDto.email,
					hash,
					avatar,
					username: createUserDto.username,
					status: UserStatus.ONLINE,
				},
			});
            console.log(`User ${user.username} with id ${user.id} created successfully`);
			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Failed to create new user');
			}
			throw error;
		}
	}

	findAll() {
		const users = this.prisma.user.findMany({ 
			select: { id: true,
					username: true,
					email: true,
					avatar: true,
					status: true
			},});
		return users;
	}

	async findById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {  id: true,
				  username: true,
				  avatar: true,
				  status: true, }})
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return user;
	}

	async updateStatus(id: number, updateUserDto: UpdateUserDto) {

	}

	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		//authenticate
		const hash = await argon.hash(updateUserDto.hash);
		const updateUser = await this.prisma.user.update({
			data: { 
			email: updateUserDto.email,
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
