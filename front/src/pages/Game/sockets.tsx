import { Dispatch, SetStateAction } from "react"
import axios, { AxiosResponse } from "axios"

import {
	updateUserInChannel,
	userIsFriend,
	userIsInChannel
} from "../../utils/functions"

import { userStatus } from "../../utils/status"
import { Channel, UserAuthenticate } from "../../utils/types"

// Fonctions appellées uniquement lors d'emits de socekts. Ces fonctions servent à mettre à jour des données en temps réel chez l'ensemble des utilisateurs 

type PropsRefreshUserStatus = {
	userId: number,
	newStatus: userStatus,

	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
}

// Met à jour le statut d'un user
export function refreshUserStatus(props: PropsRefreshUserStatus) {

	if (props.userId === props.userAuthenticate.id) {
		props.setUserAuthenticate((prevState: UserAuthenticate) => {
			return {
				...prevState,
				status: props.newStatus
			}
		})
	}
	else if (userIsFriend(props.userAuthenticate, props.userId)) {
		props.setUserAuthenticate((prevState: UserAuthenticate) => {
			return {
				...prevState,
				friends: prevState.friends.map((friend) => {
					if (friend.id === props.userId) {
						return {
							...friend,
							status: props.newStatus
						}
					}
					else
						return (friend)
				})
			}
		})

		if (props.channelTarget && userIsInChannel(props.channelTarget, props.userId)) {
			props.setChannelTarget((prevState: Channel | undefined) => {
				if (prevState)
					return updateUserInChannel(prevState, props.userId, props.newStatus)
			})
		}
	}
}

type PropsRefreshUpdateChannel = {
	channelId: number,
	newDatas: any,

	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>
}

// Met à jour les données d'un channel
export function refreshUpdateChannel(props: PropsRefreshUpdateChannel) {
	props.setChannelTarget((prevState: Channel | undefined) => {
		if (prevState) {
			return {
				...prevState,
				...props.newDatas
			}
		}
		else
			return (undefined)

	});

	props.setUserAuthenticate((prevState) => ({
		...prevState,
		channels: prevState.channels.map((channel) => {
			if (channel.id === props.channelId) {
				return {
					...channel,
					...props.newDatas
				}
			}
			else
				return channel
		})
	}))
}

type PropsRefreshDeleteChannel = {
	channelId: number,

	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>
}

// Supprime un channel
export function refreshDeleteChannel(props: PropsRefreshDeleteChannel) {
	props.setUserAuthenticate((prevState) => ({
		...prevState,
		channels: prevState.channels.filter((channel) => channel.id !== props.channelId)
	}))

	if (props.channelTarget && props.channelTarget.id === props.channelId)
		props.setChannelTarget(undefined)
}

type PropsRecieveChannelMP = {
	channelId: number,

	token: string,
	url: string,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
}

// Crée un channel MP
export async function recieveChannelMP(props: PropsRecieveChannelMP) {

	const channelMPResponse: AxiosResponse<Channel> = await axios.get(`http://${props.url}:3333/channel/${props.channelId}/relations`, {
		headers: {
			'Authorization': `Bearer ${props.token}`
		}
	})

	props.setUserAuthenticate((prevState) => ({
		...prevState,
		channels: [
			...prevState.channels,
			channelMPResponse.data
		]
	}))

	props.setChannelTarget(channelMPResponse.data)
}