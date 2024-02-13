import { userStatus } from "./status";

export const emptyUser = {
	id: 0,
	username: '',
	avatar: '',
	status: userStatus.ONLINE,
	wins: 0,
	draws: 0,
	losses: 0,
	socket: undefined
}

export const emptyUserAuthenticate = {
	id: 0,
	username: "",
	avatar: "",
	status: userStatus.ONLINE,
	wins: 0,
	draws: 0,
	losses: 0,
	socket: undefined,
	twoFA: false,
	friends: [],
	blockeds: [],
	channels: []
}

export const emptySetting = {
	value: '',
	error: false,
	errorMessage: ''
}
