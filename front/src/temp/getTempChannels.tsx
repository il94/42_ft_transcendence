import { channelStatus, userStatus } from "../utils/status";
import { ChannelData, User, UserAuthenticate } from "../utils/types";
import DefaultChannelPicture from "../assets/default_channel.png"
import TontonPicture from "../assets/xavier_niel.webp"

export function getTempChannels(userAuthenticate: UserAuthenticate, userTarget: User) : ChannelData[] {

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
				userTarget
			],
			users: [
				userAuthenticate,
				userTarget
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
				userTarget
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
				userTarget
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
				userTarget
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
			owner: userTarget,
			administrators: [
				userAuthenticate
			],
			users: [
				userAuthenticate,
				userTarget
			],
			validUsers: [
				userTarget
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
				userTarget
			],
			users: [
				userAuthenticate,
				userTarget
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
			owner: userTarget,
			administrators: [
				userTarget
			],
			users: [
				userAuthenticate,
				userTarget
			],
			validUsers: [
				userTarget
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
				userTarget
			],
			users: [
				userAuthenticate,
				userTarget
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
				userTarget
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
				userTarget
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
			type: channelStatus.PRIVATE,
			messages: [],
			owner: userTarget,
			administrators: [
				userTarget
			],
			users: [
				userTarget,
				userAuthenticate
			],
			validUsers: [
				userTarget
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
