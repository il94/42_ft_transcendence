import { Dispatch, SetStateAction } from "react"
import axios, { AxiosResponse } from "axios"

import { findUserInChannel } from "../../utils/functions"

import {
	Channel,
	Message,
	MessageInvitation,
	MessageText,
	User,
	UserAuthenticate
} from "../../utils/types"
import {
	challengeStatus,
	channelRole,
	messageStatus
} from "../../utils/status"

type PropsUpdateDiscussion = {
	idSend: number,
	idChannel: number,
	idTargetOrMsg: number | string,

	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
}

export function updateDiscussion(props: PropsUpdateDiscussion) {
	if (props.channelTarget)
	{
		console.log("here");
		let messageContent: Message;
		const userSend = findUserInChannel(props.channelTarget, props.idSend);
		if (!userSend)
			throw new Error
		if (typeof props.idTargetOrMsg === 'number')
		{

			const userTarget = findUserInChannel(props.channelTarget , props.idTargetOrMsg);
			if (!userTarget)
			throw new Error
			messageContent = {
				sender: userSend,
				type: messageStatus.INVITATION,
				target: userTarget,
				status: challengeStatus.PENDING
			} as MessageInvitation
		
		}
		else {
			messageContent ={
				sender: userSend,
				type: messageStatus.TEXT,
				content: props.idTargetOrMsg
			} as MessageText
		}
		if (props.idChannel === props.channelTarget.id)
		{
			props.setChannelTarget((prevState: Channel | undefined) => {
			if (prevState)
			{
				return {
					...prevState,
					messages: [
						...prevState.messages,
						messageContent
					]
				}
			}
			else
				return (undefined)
			});
		};
	}
};



type PropsRefreshJoinChannel = {
	channelId: number,
	userId: number,

	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,

	token: string,
	url: string

}

export async function refreshJoinChannel(props: PropsRefreshJoinChannel) {
	if (props.channelTarget?.id === props.channelId)
	{
		const userResponse: AxiosResponse<User> = await axios.get(`http://${props.url}:3333/user/${props.userId}`, {
			headers: {
				'Authorization': `Bearer ${props.token}`
			}
		})

		props.setChannelTarget((prevState: Channel | undefined) => {
			if (prevState)
			{
				return {
					...prevState,
					members: [
						...prevState.members,
						userResponse.data
					]
				}
			}
			else
				return (undefined)
		})
	}
}


type PropsRefreshLeaveChannel = {
	channelId: number,
	userId: number,

	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
}


export async function refreshLeaveChannel(props: PropsRefreshLeaveChannel) {
	if (props.userId === props.userAuthenticate.id)
	{
		props.setUserAuthenticate((prevState: UserAuthenticate) => {
			return {
				...prevState,
				channels: prevState.channels.filter((channel) => channel.id !== props.channelId)
			}
		})
		if (props.channelTarget?.id === props.channelId)
			props.setChannelTarget(undefined)
	}
	else if (props.channelTarget?.id === props.channelId)
	{
		props.setChannelTarget((prevState: Channel | undefined) => {
			if (prevState)
			{
				return {
					...prevState,
					members: prevState.members.filter((member) => member.id !== props.userId),
					administrators: prevState.administrators.filter((administrator) => administrator.id !== props.userId),
					owner: prevState.owner?.id === props.userId ? undefined : prevState.owner
				}
			}
			else
				return (undefined)
		})	
	}
}


type PropsRefreshUserRole = {
	channelId: number,
	userId: number,
	newRole: any,

	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,

	token: string,
	url: string

}

export async function refreshUserRole(props : PropsRefreshUserRole) {

	const userResponse: AxiosResponse<User> = await axios.get(`http://${props.url}:3333/user/${props.userId}`, {
		headers: {
			'Authorization': `Bearer ${props.token}`
		}
	})


	if (props.newRole === channelRole.BANNED)
	{
		if (props.userAuthenticate.id === props.userId)
		{
			props.setUserAuthenticate((prevState: UserAuthenticate) => {
				return {
					...prevState,
					channels: prevState.channels.filter((channel) => channel.id !== props.channelId)
				}
			})
			props.setChannelTarget(undefined)
		}
		else if (props.channelTarget)
		{
			props.setChannelTarget((prevState: Channel | undefined) => {
				if (prevState)
				{
					return {
						...prevState,
						members: prevState.members.filter((member) => member.id !== props.userId),
						administrators: prevState.administrators.filter((administrator) => administrator.id !== props.userId),
						banneds: [
							...prevState.banneds,
							userResponse.data
						]
					}
				}
				else
					return (undefined)
			})
		}
	}
	else if (props.newRole === channelRole.UNBANNED)
	{
		if (props.userAuthenticate.id === props.userId)
		{
			props.setUserAuthenticate((prevState: UserAuthenticate) => {
				return {
					...prevState,
					channels: prevState.channels.filter((channel) => channel.id !== props.channelId)
				}
			})
		}
		if (props.channelTarget?.id === props.channelId)
		{
			props.setChannelTarget((prevState: Channel | undefined) => {
				if (prevState)
				{
					return {
						...prevState,
						banneds: prevState.banneds.filter((banned) => banned.id !== props.userId)
					}
				}
				else
			return (undefined)
		})
		}
	}
	else if (props.channelTarget?.id === props.channelId)
	{
		if (props.newRole === channelRole.MEMBER)
		{
			const isAlreadyMember = props.channelTarget.members.find((member) => member.id === props.userId)
			const members = isAlreadyMember ? props.channelTarget.members : [ ...props.channelTarget.members, userResponse.data ]

			props.setChannelTarget((prevState: Channel | undefined) => {
				if (prevState)
				{
					return {
						...prevState,
						members: members,
						administrators: prevState.administrators.filter((administrator) => administrator.id !== props.userId)
					}
				}
				else
					return (undefined)
			})
		}
		else if (props.newRole === channelRole.ADMIN)
		{
			const isAlreadyAdministrator = props.channelTarget.administrators.find((administrator) => administrator.id === props.userId)
			const administrators = isAlreadyAdministrator ? props.channelTarget.administrators : [ ...props.channelTarget.administrators, userResponse.data ]

			props.setChannelTarget((prevState: Channel | undefined) => {
				if (prevState)
				{
					return {
						...prevState,
						members: prevState.members.filter((member) => member.id !== props.userId),
						administrators: administrators
					}
				}
				else
					return (undefined)
			})
		}			
	}
}
