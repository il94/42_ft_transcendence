import { userStatus } from "./status"

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
