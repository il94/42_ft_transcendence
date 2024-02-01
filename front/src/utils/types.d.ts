import {
	Socket
} from "socket.io-client"

import {
	userStatus,
	challengeStatus,
	MatchResultStatus,
	messageType,
	channelType
} from "./status"

export type User = {
	id: number,
	username: string,
	avatar: string,
	status: userStatus,
	wins: number,
	draws: number,
	losses: number,
	socket: Socket | undefined
}

export type UserAuthenticate = User & {
	email: string,
	phoneNumber: string,
	twoFA: boolean,
	friends: User[],
	blockeds: User[],
	channels: Channel[]
}

export type ChannelData = {
	id: number,
	createdAt?: string,
	name: string,
	avatar: string,
	type: channelType,
	password?: string
}

export type Channel = ChannelData & {
	messages: (MessageText | MessageInvitation)[],
	members: (User | UserAuthenticate)[],
	administrators: (User | UserAuthenticate)[],
	owner: User | UserAuthenticate | undefined,
	mutedUsers: (User | UserAuthenticate)[],
	banneds: (User | UserAuthenticate)[]
}

export type Message = {
	id: number,
	createdAt?: string,
	sender: User | UserAuthenticate,
	type: messageType
}

export type MessageText = Message & {
	content: string,
}

export type MessageInvitation = Message & {
	target: User | UserAuthenticate,
	status: challengeStatus
}

export type MatchData = {
	id: number,
	user: User | UserAuthenticate,
	opponent: User | UserAuthenticate,
	result: matchResultStatus,
	scoreUser: number,
	scoreOpponent: number
}

export type SettingData = {
	value: string,
	error: boolean,
	errorMessage?: string | string[]
}

export type ErrorResponse = {
	error: string,
	message: string,
	statusCode: number
}