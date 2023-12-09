export enum userStatus {
	ONLINE = "En ligne",
	OFFLINE = "Hors ligne",
	PLAYING = "En jeu",
	WAITING = "En recherche de partie",
	WATCHING = "Spectateur"	
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
	PRIVATE = "Private"
}

export enum chatWindowStatus {
	CHANNEL,
	CREATE_CHANNEL,
	UPDATE_CHANNEL
}