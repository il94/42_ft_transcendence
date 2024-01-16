import { Socket } from "socket.io-client"
import {
	userStatus,
	challengeStatus,
	MatchResultStatus,
	messageStatus,
	channelStatus
} from "./status"

export type User = {
	id: number,
	username: string,
	avatar: string,
	status: userStatus,
	scoreResume: {
		wins: number,
		draws: number,
		losses: number
	},
	socket: Socket | undefined
}

export type UserAuthenticate = User & {
	email: string,
	phoneNumber: string,
	twoFA: boolean,
	friends: User[],
	blockedUsers: User[],
	channels: Channel[]
}

export type Channel = {
	id: number,
	name: string,
	avatar: string,
	type: channelStatus,
	password?: string,
	messages: (MessageText | MessageInvitation)[],
	owner: User | UserAuthenticate,
	administrators: (User | UserAuthenticate)[],
	users: (User | UserAuthenticate)[],
	validUsers: (User | UserAuthenticate)[],
	mutedUsers: (User | UserAuthenticate)[],
	bannedUsers: (User | UserAuthenticate)[]
}

export type Message = {
	//id?: number,
	createdAt?: string,
	sender: User | UserAuthenticate,
	type: messageStatus
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
	errorMessage?: string
}