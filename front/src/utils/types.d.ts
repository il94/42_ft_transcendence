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
		looses: number
	}
}
export type UserAuthenticate = User & {
	hash: string,
	email: string,
	tel: string,
	twoFA: boolean,
	createdAt: string,
	friends: User[],
	blockedUsers: User[],
	channels: ChannelData[]
}

export type ChannelData = {
	id: number,
	createdAt?: string,
	name: string,
	avatar: string,
	type: channelStatus,
	password?: string,
	owner: User | UserAuthenticate,
	administrators: (User | UserAuthenticate)[],
	users: (User | UserAuthenticate)[],
	validUsers: (User | UserAuthenticate)[],
	mutedUsers: (User | UserAuthenticate)[],
	bannedUsers: (User | UserAuthenticate)[]
}

export type Message = {
	id: number,
	createdAt?: string,
	sender: User | UserAuthenticate,
	type: messageStatus
}
export type MessageText = Message & {
	content: string,
}
export type MessageInvitation = Message & {
	target: User | UserAuthenticate,
	status: string
}

export type MatchData = {
	id: number,
	user: User | UserAuthenticate,
	opponent: User | UserAuthenticate,
	result: matchResultStatus,
	scoreUser: number,
	scoreOpponent: number
}