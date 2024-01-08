import { challengeStatus, channelStatus, messageStatus, userStatus } from "../utils/status";
import { Channel, User, UserAuthenticate } from "../utils/types";
import DefaultChannelPicture from "../assets/default_channel.png"
import DefaultBluePicture from "../assets/default_blue.png"
import TontonPicture from "../assets/xavier_niel.webp"
import { createContext } from "react";

export function getTempChannels(userAuthenticate: UserAuthenticate) : Channel[] {

	const osef = {
		id: -1,
		username: "Osef",
		avatar: '',
		status: userStatus.ONLINE,
		scoreResume: {
			wins: 0,
			draws: 0,
			losses: 0
		},
		socket: undefined
	}

	const result: Channel[] = [
		{
			id: -1,
			name: "BAGARRE",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.INVITATION,
					target: userSomeone,
					status: challengeStatus.PENDING
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.INVITATION,
					target: userAuthenticate,
					status: challengeStatus.PENDING
				},
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.INVITATION,
					target: userSomeone,
					status: challengeStatus.ACCEPTED
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.INVITATION,
					target: userAuthenticate,
					status: challengeStatus.ACCEPTED
				},
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.INVITATION,
					target: userSomeone,
					status: challengeStatus.CANCELLED
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.INVITATION,
					target: userAuthenticate,
					status: challengeStatus.CANCELLED
				},
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.INVITATION,
					target: userSomeone,
					status: challengeStatus.IN_PROGRESS
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.INVITATION,
					target: userAuthenticate,
					status: challengeStatus.IN_PROGRESS
				},
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.INVITATION,
					target: userSomeone,
					status: challengeStatus.FINISHED
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.INVITATION,
					target: userAuthenticate,
					status: challengeStatus.FINISHED
				},
			],
			owner: userAuthenticate,
			administrators: [
				userAuthenticate,
				userSomeone
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userAuthenticate
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Owner / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Owner"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				}
			],
			owner: userAuthenticate,
			administrators: [
				userAuthenticate,
				userSomeone
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userAuthenticate
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Owner / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Owner"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				}
			],

			owner: userAuthenticate,
			administrators: [
				userAuthenticate
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userAuthenticate
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Admin / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				}
			],
			owner: osef,
			administrators: [
				userAuthenticate
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				osef
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Member / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
			],

			owner: osef,
			administrators: [
				osef
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				osef
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Admin / O",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Owner"
				},
			],

			owner: userSomeone,
			administrators: [
				userAuthenticate
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userSomeone
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Admin / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				},
			],

			owner: osef,
			administrators: [
				userAuthenticate,
				userSomeone
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				osef
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Member / O",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Owner"
				},
			],

			owner: userSomeone,
			administrators: [
				userSomeone
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userSomeone
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Member / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi l'Admin"
				},
			],

			owner: osef,
			administrators: [
				userSomeone
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				osef
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: -1,
			name: "Member / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [
				{
					id: -1,
					sender: userAuthenticate,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Salut c'est moi le Membre"
				},
			],

			owner: osef,
			administrators: [
				osef
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				osef
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: 4,
			name: "Private",
			avatar: DefaultChannelPicture,
			type: channelStatus.PRIVATE,
			messages: [
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "Channel prive"
				},
			],

			owner: userAuthenticate,
			administrators: [
				userAuthenticate
			],
			users: [
				userAuthenticate,
				userSomeone
			],
			validUsers: [
				userAuthenticate
			],
			mutedUsers: [],
			bannedUsers: []
		},
		{
			id: 5,
			name: "MP",
			avatar: TontonPicture,
			type: channelStatus.MP,
			messages: [
				{
					id: -1,
					sender: userSomeone,
					type: messageStatus.TEXT,
					content: "MP"
				}
			],

			owner: userSomeone,
			administrators: [],
			users: [
				userSomeone,
				userAuthenticate
			],
			validUsers: [
				userSomeone
			],
			mutedUsers: [],
			bannedUsers: []
		}
	]

	return (result)
}

export function getRandomStatus() {
	const status = [
		userStatus.ONLINE,
		userStatus.OFFLINE,
		userStatus.PLAYING,
		userStatus.WAITING,
		userStatus.WATCHING
	]

	/* ====================================== */

	const randomStatus = Math.floor(Math.random() * 5)

	return (status[randomStatus])
}

//temporaire
export const userSomeone: User = {
	id: 5,
	username: "Someone",
	avatar: DefaultBluePicture,
	status: userStatus.ONLINE,
	scoreResume: {
		wins: 0,
		draws: 0,
		losses: 0
	},
	socket: undefined
}

export const TempContext = createContext<{
	userSomeone: User,
} | undefined>(undefined)
