import { userStatus, challengeStatus } from "./status"

export type User = {
	id: number,
	username: string,
	avatar: string,
	status: string,
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
	createdAt: string,
}

export type Channel = {
	id: number,
	createdAt?: string,
	name: string,
	avatar: string,
	type: string,
	password?: string
}

export type Message = {
	id: number,
	createdAt?: string,
	sender: string, // a remplacer par User
	type: string
}

export type MessageText = Message & {
	content: string,
}

export type MessageInvitation = Message & {
	target: string // a remplacer par User
	status: string
}

export type SearchBarOption = {
	id: number,
	value: string,
	label: string,
	type: string
}
