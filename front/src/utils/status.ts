export enum userStatus {
	ONLINE = "Online",
	PLAYING = "Playing",
	WAITING = "Looking for a game...",
	WATCHING = "Spectator",
	OFFLINE = "Offline"
}

export enum challengeStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	CANCELLED = "cancelled",
	IN_PROGRESS = "in progress",
	FINISHED = "finished"
}

export enum channelStatus {
	PUBLIC = "Public",
	PROTECTED = "Protected",
	PRIVATE = "Private",
	MP = "Direct messages"
}

export enum chatWindowStatus {
	HOME,
	CHANNEL,
	LOCKED_CHANNEL,
	CREATE_CHANNEL,
	UPDATE_CHANNEL
}

export enum messageStatus {
	TEXT,
	INVITATION
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