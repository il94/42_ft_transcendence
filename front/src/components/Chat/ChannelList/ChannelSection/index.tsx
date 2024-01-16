import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"
import axios, { AxiosResponse } from "axios"

import {
	Style,
	Avatar,
	ChannelName
} from "./style"

import AuthContext from "../../../../contexts/AuthContext"

import { Channel, User } from "../../../../utils/types"
import { messageStatus, channelStatus } from "../../../../utils/status"

type PropsChannel = {
	channel: Channel,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	setErrorRequest: Dispatch<SetStateAction<boolean>>,
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


function ChannelSection({ channel, setChannelTarget, setErrorRequest, backgroundColor }: PropsChannel) {

	const { token } = useContext(AuthContext)!
	
	async function handleClickEvent() {
		try {

			const channelResponse: AxiosResponse<Channel> = await axios.get(`http://localhost:3333/channel/${channel.id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			const msgFront = await transformMessagesText(channel.id , token, response.data.members);

			if (channelResponse.data.type === channelStatus.MP)
			{
				const { name, avatar, ...rest } = channelResponse.data

				setChannelTarget({
					...rest,
					name: channel.name,
					avatar: channel.avatar,
          messages: msgFront
				})
			}
			else
      {
        setChannelTarget({
					...rest,
					name: name,
					avatar: avatar,
          messages: msgFront
				})
				// setChannelTarget(channelResponse.data)
      }
		}
		catch (error) {
			setErrorRequest(true)
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