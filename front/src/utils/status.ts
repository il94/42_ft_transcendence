export enum userStatus {
	ONLINE = "ONLINE",
	WATCHING = "WATCHING",
	WAITING = "WAITING",
	PLAYING = "PLAYING",
	OFFLINE = "OFFLINE"
}

export enum challengeStatus {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	CANCELLED = "CANCELLED",
	IN_PROGRESS = "IN_PROGRESS",
	FINISHED = "FINISHED"
}

export enum ChannelType {
	PUBLIC = "PUBLIC",
	PROTECTED = "PROTECTED",
	PRIVATE = "PRIVATE",
	MP = "MP"
}

export enum channelRole {
	MEMBER = "MEMBER",
	ADMIN = "ADMIN",
	OWNER = "OWNER",
	BANNED = "BANNED",
	UNBANNED = "UNBANNED"
}

export enum chatWindowStatus {
	HOME,
	CHANNEL,
	LOCKED_CHANNEL,
	CREATE_CHANNEL,
	UPDATE_CHANNEL
}

export enum messageType {
	TEXT = "TEXT",
	INVITATION = "INVITATION"
}

export enum logType {
	JOIN = "JOIN",
	INVITE = "INVITE",
	LEAVE = "LEAVE",
	UPGRADE = "UPGRADE",
	DOWNGRADE = "DOWNGRADE",
	NEW_OWNER = "NEW_OWNER",
	MUTE = "MUTE",
	KICK = "KICK",
	BAN = "BAN",
	UNBAN = "UNBAN"
}

export enum matchResultStatus {
	WINNER = "WINNER",
	DRAW = "DRAW",
	LOOSER = "LOOSER"
}

export enum contextualMenuStatus {
	SOCIAL,
	CHAT
}

export enum resultSearchBarType {
	USER = "USER",
	CHANNEL = "CHANNEL"
}

export enum ranks {
	NORANK = "NO RANK",
	BRONZE = "BRONZE",
	SILVER = "SILVER",
	GOLD = "GOLD",
}