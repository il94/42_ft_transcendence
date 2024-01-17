import { userStatus } from "./status"
import { Channel, User, UserAuthenticate } from "./types"

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


export function findUserInChannel(channel: Channel, user: User | UserAuthenticate): User | UserAuthenticate | undefined {
	const inMembers = channel.members.find((member) => member.id === user.id)
	if (inMembers)
		return (inMembers)
	const inAdministrators = channel.administrators.find((administrator) => administrator.id === user.id)
	if (inAdministrators)
		return (inAdministrators)
	const isOwner = channel.owner?.id === user.id && channel.owner
	if (isOwner)
		return (isOwner)
	else
		return (undefined)
}

export function channelIncludeUser(channel: Channel, user: User | UserAuthenticate): boolean {
	return (
		channel.members.some((member) => member?.id === user.id) ||
		channel.administrators.some((administrator) => administrator?.id === user.id) ||
		channel.owner?.id === user.id
	)
}

export function channelIsEmpty(channel: Channel): boolean {
	return (
		channel.members.length === 0 &&
		channel.administrators.length === 0 &&
		channel.owner === undefined
	)
}