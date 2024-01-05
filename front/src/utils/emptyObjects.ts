import { userStatus } from "./status";

export const emptyUser = {
	id: -1,
	username: '',
	avatar: '',
	status: userStatus.ONLINE,
	scoreResume: {
		wins: 0,
		draws: 0,
		losses: 0
	}
}

export const emptyUserAuthenticate = {
	id: -1,
	username: "",
	avatar: "",
	status: userStatus.ONLINE,
	scoreResume: {
		wins: 0,
		draws: 0,
		losses: 0
	},
	email: "",
	phoneNumber: "",
	twoFA: false,
	friends: [],
	blockedUsers: [],
	channels: []
}

export const emptySetting = {
	value: '',
	error: false,
	errorMessage: ''
}