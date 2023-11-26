import status from "./status"

export type User = {
	id: number,
	id42?: number,
	createdAt?: string,
	username: string,
	hash: string,
	email?: string,
	tel?: string,
	profilePicture: string,
	state: string,
	scoreResume: {
		wins: number,
		draws: number,
		looses: number
	}
}

export type Channel = {
	id: number,
	createdAt?: string,
	name: string,
	picture: string,
	type: string
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
	state: status
}