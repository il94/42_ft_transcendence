import {
	channelStatus,
	contextualMenuStatus,
	userStatus
} from "./status"

import {
	Channel,
	User,
	UserAuthenticate
} from "./types"

import DefaultBlackAvatar from "../assets/default_black.png"
import DefaultBlueAvatar from "../assets/default_blue.png"
import DefaultGreenAvatar from "../assets/default_green.png"
import DefaultPinkAvatar from "../assets/default_pink.png"
import DefaultPurpleAvatar from "../assets/default_purple.png"
import DefaultRedAvatar from "../assets/default_red.png"
import DefaultYellowAvatar from "../assets/default_yellow.png"

export function capitalize(str: string): string {
	return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
}

export function getRandomDefaultAvatar(): string {

	const defaultAvatars: string[] = [
		DefaultBlackAvatar,
		DefaultBlueAvatar,
		DefaultGreenAvatar,
		DefaultPinkAvatar,
		DefaultPurpleAvatar,
		DefaultRedAvatar,
		DefaultYellowAvatar
	]

	const randomIndex = Math.floor(Math.random() * defaultAvatars.length)

	return (defaultAvatars[randomIndex])
}

export async function getContextualMenuHeight(type: contextualMenuStatus, userTarget: User, userAuthenticate: UserAuthenticate, channel?: Channel) { // determine la taille du menu par rapport aux status du user authentifie et de la cible
	
	const sectionSize: number = 35

	let size: number = 0

	// Invite section
	if (userAuthenticate.channels.length > 0)
		size += sectionSize

	// Contact section
		size += sectionSize

	// Challenge section
	if (userTarget.status !== userStatus.OFFLINE)
		size += sectionSize

	// Spectate section
	if (userTarget.status === userStatus.PLAYING)
		size += sectionSize

	// Add / Delete section
		size += sectionSize

	// Block / Unblock section
		size += sectionSize

	if (type === contextualMenuStatus.CHAT && channel)
	{
		if (channel.owner?.id === userAuthenticate.id)
		{
			// Upgrade / Downgrade section
			// Mute / Unmute section
			// Kick section
			// Ban section
			if (userIsInChannel(channel, userTarget.id))
				size += sectionSize * 4
		
			// Unban section
			else if (userIsBanned(channel, userTarget.id))
				size += sectionSize
		}
		else if (userIsAdministrator(channel, userAuthenticate.id))
		{
			// Mute / Unmute section
			// Kick section
			// Ban section
			if (userIsMember(channel, userTarget.id))
				size += sectionSize * 3
		}
	}

	return (size)
}


export function sortUserByName(a: User, b: User) {
	return (a.username.localeCompare(b.username))
}

export function sortChannelByName(a: Channel, b: Channel) {
	return (a.name.localeCompare(b.name))
}

export function sortUserByStatus(a: User, b: User) {

	const status = [userStatus.ONLINE, userStatus.WATCHING, userStatus.WAITING, userStatus.PLAYING, userStatus.OFFLINE]

	const aValue = status.indexOf(a.status)
	const bValue = status.indexOf(b.status)

	return (aValue - bValue)
}

export function getAllUsersInChannel(channel: Channel): User[] {
	const users = [
		...(channel.members || []),
		...(channel.administrators || []),
		(channel.owner ? channel.owner : [])
	].filter(user => user !== undefined) as User[]

	return (users)
}

export function findUserInChannel(channel: Channel, userId: number): User | UserAuthenticate | undefined {
	const inMembers = channel.members.find((member) => member.id === userId)
	if (inMembers)
		return (inMembers)
	const inAdministrators = channel.administrators.find((administrator) => administrator.id === userId)
	if (inAdministrators)
		return (inAdministrators)
	const isOwner = channel.owner?.id === userId && channel.owner
	if (isOwner)
		return (isOwner)
	else
		return (undefined)
}

export function findChannelMP(userAuthenticate: UserAuthenticate, recipientName: string): Channel | undefined {
	return (
		userAuthenticate.channels.find((channel) => (
		channel.name === recipientName && channel.type === channelStatus.MP))
	)
}

export function userIsFriend(userAuthenticate: UserAuthenticate, userId: number): boolean {
	return (
		!!userAuthenticate.friends.some((friend) => friend.id === userId)
	)
}

export function userIsBlocked(userAuthenticate: UserAuthenticate, userId: number): boolean {
	return (
		!!userAuthenticate.blockeds.some((friend) => friend.id === userId)
	)
}

export function userIsInChannel(channel: Channel, userId: number): boolean {
	return (
		userIsMember(channel, userId) ||
		userIsAdministrator(channel, userId) ||
		userIsOwner(channel, userId)
	)
}

export function userIsMember(channel: Channel, userId: number): boolean {
	return (
		!!channel.members.some((member) => member.id === userId)
	)
}

export function userIsAdministrator(channel: Channel, userId: number): boolean {
	return (
		!!channel.administrators.some((administrator) => administrator.id === userId)
	)
}

export function userIsOwner(channel: Channel, userId: number): boolean {
	return (
		channel.owner?.id === userId
	)
}

export function userIsBanned(channel: Channel, userId: number): boolean {
	return (
		!!channel.banneds.some((banned) => banned.id === userId)
	)
}

export function channelIsEmpty(channel: Channel): boolean {
	return (
		channel.members.length === 0 &&
		channel.administrators.length === 0 &&
		channel.owner === undefined
	)
}

export function updateUserInChannel(channel: Channel, userId: number, newStatus: userStatus): Channel {
	return {
		...channel,
		members: channel.members.map((member) => {
			if (member.id === userId)
			{
				return {
					...member,
					status: newStatus
				}
			}
			else
				return (member)
		}),
		administrators: channel.administrators.map((administrator) => {
			if (administrator.id === userId)
			{
				return {
					...administrator,
					status: newStatus
				}
			}
			else
				return (administrator)
		}),
		owner: channel.owner?.id === userId ? channel.owner as User : {
			...(channel.owner as User), status: newStatus
		}
	}
}
