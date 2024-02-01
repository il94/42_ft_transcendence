import { userStatus } from "./status";

export const emptyUser = {
	id: -1,
	username: '',
	avatar: '',
	status: userStatus.ONLINE,
	wins: 0,
	draws: 0,
	losses: 0,
	socket: undefined
}

export const emptyUserAuthenticate = {
	id: -1,
	username: "",
	avatar: "",
	status: userStatus.ONLINE,
	wins: 0,
	draws: 0,
	losses: 0,
	socket: undefined,
	email: "",
	phoneNumber: "",
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