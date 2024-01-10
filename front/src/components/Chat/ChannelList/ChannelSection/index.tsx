import { Dispatch, SetStateAction, useContext } from "react"
import axios, { AxiosResponse } from "axios"

import { Style, Avatar, ChannelName } from "./style"

import AuthContext from "../../../../contexts/AuthContext"

import { Channel } from "../../../../utils/types"

type PropsChannel = {
	channel: Channel,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	backgroundColor: string
}

function ChannelSection({ channel, setChannelTarget, backgroundColor }: PropsChannel) {

	const { token } = useContext(AuthContext)!

	async function handleClickEvent() {
		try {

			const response: AxiosResponse = await axios.get(`http://localhost:3333/channel/${channel.id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			const owner = response.data.members.find((member: any) => {
				return member.role === "OWNER"
			}).user
			
			const admins = response.data.members.filter((member: any) => {
				return member.role === "ADMIN"
			}).map((member: any) => {
				return member.user
			})
			
			const users = response.data.members.filter((member: any) => {
				return member.role === "USER"
			}).map((member: any) => {
				return member.user
			})
			
			setChannelTarget(() => ({
				...channel,
				messages: [], // a recup depuis le back
				owner: owner,
				administrators: [owner, ...admins],
				users: [owner, ...admins, ...users],
				validUsers: [], // a recup depuis le back
				bannedUsers: [] // a recup depuis le back
			}))
		
		}
		catch (error) {
			console.log(error)
		}
	}

	return (
		<Style
			onClick={handleClickEvent}
			$backgroundColor={backgroundColor}>
			<Avatar src={channel.avatar} />
			<ChannelName>
				{channel.name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection