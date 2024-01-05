import { userStatus } from "./status"
import { ChannelData, User } from "./types"

import DefaultBlackAvatar from "../assets/default_black.png"
import DefaultBlueAvatar from "../assets/default_blue.png"
import DefaultGreenAvatar from "../assets/default_green.png"
import DefaultPinkAvatar from "../assets/default_pink.png"
import DefaultPurpleAvatar from "../assets/default_purple.png"
import DefaultRedAvatar from "../assets/default_red.png"
import DefaultYellowAvatar from "../assets/default_yellow.png"

export function getStatus(status: string)
{
	if (status === "ONLINE")
		return (userStatus.ONLINE)
	else if (status === "OFFLINE")
		return (userStatus.OFFLINE)
	else if (status === "PLAYING")
		return (userStatus.PLAYING)
	else if (status === "WAITING")
		return (userStatus.WAITING)
	else if (status === "WATCHING")
		return (userStatus.WATCHING)
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

export function sortChannelByName(a: ChannelData, b: ChannelData) {
	return (a.name.localeCompare(b.name))
}

export function sortUserByStatus(a: User, b: User) {

	const status = [userStatus.ONLINE, userStatus.WATCHING, userStatus.WAITING, userStatus.PLAYING, userStatus.OFFLINE]

	const aValue = status.indexOf(a.status)
	const bValue = status.indexOf(b.status)

	return (aValue - bValue)
}

export function deleteScoreFormatFromBack(friend: any) {
	delete friend.wins
	delete friend.draws
	delete friend.losses
}