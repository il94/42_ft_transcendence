export enum userStatus {
	ONLINE = "ONLINE",
	PLAYING = "PLAYING",
	WAITING = "LOOKING FOR A GAME...",
	WATCHING = "SPECTATOR",
	OFFLINE = "OFFLINE"
}

export enum challengeStatus {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	CANCELLED = "CANCELLED",
	IN_PROGRESS = "IN_PROGRESS",
	FINISHED = "FINISHED"
}

export enum channelStatus {
	PUBLIC = "PUBLIC",
	PROTECTED = "PROTECTED",
	PRIVATE = "PRIVATE",
	MP = "MP"
}

export enum channelRole {
	MEMBER = "MEMBER",
	ADMIN = "ADMIN",
	OWNER = "OWNER",
	BANNED = "BANNED"
}

export enum chatWindowStatus {
	HOME,
	CHANNEL,
	LOCKED_CHANNEL,
	CREATE_CHANNEL,
	UPDATE_CHANNEL
}

export enum messageStatus {
	TEXT = "TEXT",
	INVITATION = "INVITATION"
}

export enum matchResultStatus {
	WIN,
	DRAW,
	LOOSE
}

export enum contextualMenuStatus {
	SOCIAL,
	CHAT
}