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

export function channelIncludeUser(channel: Channel, user: User | UserAuthenticate): boolean {
	return (
		channel.users.some((member) => member?.id === user.id) ||
		channel.administrators.some((administrator) => administrator?.id === user.id) ||
		channel.owner?.id === user.id
	)
}

export function channelIsEmpty(channel: Channel): boolean {
	return (
		channel.users.length === 0 &&
		channel.administrators.length === 0 &&
		channel.owner === undefined
	)
}