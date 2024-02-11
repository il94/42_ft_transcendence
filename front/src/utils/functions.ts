import {
	ChangeEvent,
	Dispatch,
	SetStateAction
} from "react"

import {
	ChannelType,
	contextualMenuStatus,
	userStatus
} from "./status"

import {
	Channel,
	ChannelData,
	MessageLog,
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

function endsWithImageExtension(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.webp', '.svg', '.heif', '.heic']
    const lowerCaseFileName = fileName.toLowerCase()
    return imageExtensions.some(ext => lowerCaseFileName.endsWith(ext))
}

export function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>, setAvatar: Dispatch<SetStateAction<string>>, displayPopupError: Dispatch<SetStateAction<{ display: boolean, message?: string }>>) {
	const avatar = event.target.files?.[0]

	if (!avatar)
	{
		displayPopupError({ display: true, message: "No image" })
		return
	}
	else if (!endsWithImageExtension(avatar.name))
	{
		displayPopupError({ display: true, message: "Bad image extension" })
		return
	}

	const reader = new FileReader()

	reader.onloadend = () => {
		const imageDataUrl = reader.result
		if (typeof imageDataUrl === 'string')
			setAvatar(imageDataUrl)
	}

	reader.onerror = () => {
		displayPopupError({ display: true, message: "Invalid image" })
	}
	reader.readAsDataURL(avatar)
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
	if (userAuthenticate.channels.length > 0 &&
		!userIsBlocked(userAuthenticate, userTarget.id))
		size += sectionSize

	// Contact section
	if (!userIsBlocked(userAuthenticate, userTarget.id))
		size += sectionSize

	// Challenge section
	if (userAuthenticate.status === userStatus.ONLINE &&
		userTarget.status === userStatus.ONLINE)
		size += sectionSize

	// Spectate section
	if (userAuthenticate.status === userStatus.ONLINE &&
		userTarget.status === userStatus.PLAYING)
		size += sectionSize

	// Add / Delete section
		size += sectionSize

	// Block / Unblock section
		size += sectionSize

	if (type === contextualMenuStatus.CHAT && channel)
	{
		if (userIsOwner(channel, userAuthenticate.id))
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
			if (userIsMember(channel, userTarget.id)
				|| userIsAdministrator(channel, userTarget.id))
				size += sectionSize * 3

			// Unban section
			else if (userIsBanned(channel, userTarget.id))
				size += sectionSize
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

export function findChannelMP(userAuthenticate: UserAuthenticate, recipientName: string): Channel | ChannelData | undefined {
	return (
		userAuthenticate.channels.find((channel) => (
		channel.name === recipientName && channel.type === ChannelType.MP))
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

export function channelIsPublic(channel: Channel): boolean {
	return (
		channel.type === ChannelType.PUBLIC
	)
}

export function channelIsProtected(channel: Channel): boolean {
	return (
		channel.type === ChannelType.PROTECTED
	)
}

export function channelIsPrivate(channel: Channel): boolean {
	return (
		channel.type === ChannelType.PRIVATE
	)
}

export function channelIsMP(channel: Channel): boolean {
	return (
		channel.type === ChannelType.MP
	)
}

export function channelIsEmpty(channel: Channel): boolean {
	return (
		channel.members.length === 0 &&
		channel.administrators.length === 0 &&
		channel.owner === undefined
	)
}

export function setUserToMember(channel: Channel, user: User | UserAuthenticate, log: MessageLog): Channel {
	const isAlreadyMember = userIsMember(channel, user.id)
	const members = isAlreadyMember ? channel.members : [ ...channel.members, user ]

	return {
		...channel,
		members: members,
		administrators: channel.administrators.filter((administrator) => administrator.id !== user.id),
		messages: [
			...channel.messages,
			log
		]
	}
}

export function setUserToAdministrator(channel: Channel, user: User | UserAuthenticate, log: MessageLog): Channel {
	const isAlreadyAdministrator = userIsAdministrator(channel, user.id)
	const administrators = isAlreadyAdministrator ? channel.administrators : [ ...channel.administrators, user ]

	return {
		...channel,
		members: channel.members.filter((member) => member.id !== user.id),
		administrators: administrators,
		messages: [
			...channel.messages,
			log
		]
	}
}

export function setUserToOwner(channel: Channel, user: User | UserAuthenticate): Channel {
	const isAlreadyOwner = userIsOwner(channel, user.id)
	const owner = isAlreadyOwner ? channel.owner : user

	return {
		...channel,
		members: channel.members.filter((member) => member.id !== user.id),
		administrators: channel.administrators.filter((administrator) => administrator.id !== user.id),
		owner: owner
	}
}

export function setUserToBanned(channel: Channel, user: User | UserAuthenticate, log: MessageLog): Channel {
	const isAlreadyBanned = userIsBanned(channel, user.id)
	const banneds = isAlreadyBanned ? channel.banneds : [ ...channel.banneds, user ]

	return {
		...channel,
		members: channel.members.filter((member) => member.id !== user.id),
		administrators: channel.administrators.filter((administrator) => administrator.id !== user.id),
		banneds: banneds,
		messages: [
			...channel.messages,
			log
		]
	}
}

export function removeUserInChannel(channel: Channel, userId: number, log?: MessageLog): Channel {

	if (log)
		return {
			...channel,
			members: channel.members.filter((member) => member.id !== userId),
			administrators: channel.members.filter((member) => member.id !== userId),
			owner: channel.owner?.id === userId ? undefined : channel.owner,
			banneds: channel.banneds.filter((banned) => banned.id !== userId),
			messages: [
				...channel.messages,
				log
			]
		}
	else
		return {
			...channel,
			members: channel.members.filter((member) => member.id !== userId),
			administrators: channel.members.filter((member) => member.id !== userId),
			owner: channel.owner?.id === userId ? undefined : channel.owner,
			banneds: channel.banneds.filter((banned) => banned.id !== userId),
		}
}
