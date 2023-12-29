import { channelStatus, userStatus } from "../utils/status";
import { ChannelData, User, UserAuthenticate } from "../utils/types";
import DefaultChannelPicture from "../assets/default_channel.png"
import DefaultBluePicture from "../assets/default_blue.png"
import TontonPicture from "../assets/xavier_niel.webp"
import { createContext } from "react";

export function getTempChannels(userAuthenticate: UserAuthenticate) : ChannelData[] {

	const osef = {
		id: 0,
		username: "Osef",
		avatar: '',
		status: userStatus.ONLINE,
		scoreResume: {
			wins: 0,
			draws: 0,
			looses: 0
		}
	}


	const result: ChannelData[] = [
		{
			id: 0,
			name: "Owner / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Owner / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Admin / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Member / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Admin / O",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Admin / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Member / O",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Member / A",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			id: 0,
			name: "Member / M",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC,
			messages: [],
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
			messages: [],
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
			messages: [],
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
		looses: 0
	}
}

export const TempContext = createContext<{
	userSomeone: User,
} | undefined>(undefined)
