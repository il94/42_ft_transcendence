import { Dispatch, SetStateAction, useContext } from "react"
import axios, { AxiosResponse } from "axios"

import { Style, Avatar, ChannelName } from "./style"

import AuthContext from "../../../../contexts/AuthContext"

import { Channel, User } from "../../../../utils/types"
import { messageStatus } from "../../../../utils/status"

type PropsChannel = {
	channel: Channel,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	backgroundColor: string
}


/* 
	soso renvoie le user a partir du userid
	parmis les membre du channel
*/

function findUserInChannels(users: any, userId: number): User | undefined {
	const foundUser = users.find(member => member.user.id === userId);
	return foundUser?.user;
  }

/*

  soso renvoie les messages d'un channel recu du back dans le front pour l'affichage
  gestion des messagesStatus.Text

*/

async function transformMessagesText(channelId: number, token: string, members: any): Promise<any[]> {
	
	const msg = await axios.get(`http://localhost:3333/channel/${channelId}/message`, {
	  headers: {
		'Authorization': `Bearer ${token}`
	  }
	});

	const cleanedMessages = msg.data.map(({ channelId, isInvit, status, ...rest }) => rest);
  
	const msgRes = cleanedMessages.map(({ authorId, ...rest }) => {
	  const sender = findUserInChannels(members, authorId);
	  return { sender, ...rest };
	});

	return msgRes;
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

			const msgFront = await transformMessagesText(channel.id , token, response.data.members);
	
			setChannelTarget(() => ({
				...channel,
				messages: msgFront, 
				owner: owner,
				administrators: admins,
				users: users,
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