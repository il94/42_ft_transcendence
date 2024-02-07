import {
	Socket
} from "socket.io-client"

import {
	userStatus,
	challengeStatus,
	MatchResultStatus,
	messageType,
	ChannelType
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
	type: ChannelType,
	password?: string
}

export type Channel = ChannelData & {
	messages: (MessageText | MessageInvitation)[],
	members: (User | UserAuthenticate)[],
	administrators: (User | UserAuthenticate)[],
	owner: User | UserAuthenticate | undefined,
	banneds: (User | UserAuthenticate)[],
	muteInfo: Record<number, string>
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
	username: string
	opponentname: string,
	result: matchResultStatus,
	userScore: number,
	opponentScore: number
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