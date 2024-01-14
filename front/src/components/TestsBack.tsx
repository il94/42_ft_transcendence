import axios, { AxiosResponse } from "axios"
import styled from "styled-components"

import DefaultBlackAvatar from "../assets/default_black.png"
import DefaultBlueAvatar from "../assets/default_blue.png"
import DefaultGreenAvatar from "../assets/default_green.png"
import DefaultPinkAvatar from "../assets/default_pink.png"
import DefaultPurpleAvatar from "../assets/default_purple.png"
import DefaultRedAvatar from "../assets/default_red.png"
import DefaultYellowAvatar from "../assets/default_yellow.png"
import DefaultChannel from "../assets/default_channel.png"
import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import { User } from "../utils/types"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: absolute;
	top: 8%;
	left: 50%;

	width: 180px;
	height: 680px;

	background-color: #a84152;
	
`

const Bout = styled.button`

	width: 150px;

	height: 50px;

	margin-bottom: 20px;

	color: black;
`


function TestsBack() {

	const { token } = useContext(AuthContext)!

	function getRandomDefaultAvatar(): string {
		const defaultAvatars: string[] = [
			DefaultBlackAvatar,
			DefaultBlueAvatar,
			DefaultGreenAvatar,
			DefaultPinkAvatar,
			DefaultPurpleAvatar,
			DefaultRedAvatar,
			DefaultYellowAvatar
		]
		const randomIndex = Math.floor(Math.random() * defaultAvatars.length)

		return (defaultAvatars[randomIndex])
	}

/* =============================== USERS ==================================== */

	async function getUsers() {
		try {
			const test = await axios.get("http://localhost:3333/user", {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			console.log("USERS = ", test)
		}
		catch (error) {
			console.log(error)
		}
	}

	async function postUser() {
		try {
			const test = await axios.post("http://localhost:3333/auth/signup",
				{
					username: "user",
					hash: "123456",
					email: "user@test.fr",
					avatar: getRandomDefaultAvatar(),
					phoneNumber: "0000000000"
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			)
			console.log("USER = ", test)
		}
		catch (error) {
			console.log(error)
		}
	}

	async function postUsers() {
		try {
			let i = 0

			while (i < 5)
			{
				let test = await axios.post("http://localhost:3333/auth/signup",
					{
						username: `user_${i}`,
						hash: "123456",
						email: `user_${i}@test.fr`,
						avatar: getRandomDefaultAvatar(),
						phoneNumber: "0000000000"
					},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				)
				console.log("USER", i, " = ", test)
				i++
			}
		}
		catch (error) {
			console.log(error)
		}
	}

/* ============================== CHANNELS ================================== */

	async function getChannel() {
		try {
			const test = await axios.get("http://localhost:3333/channel", {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			console.log("CHANNELS = ", test)

		}
		catch (error) {
			console.log(error)
		}
	}

	async function postChannel() {
		try {
			const test = await axios.post("http://localhost:3333/channel",
				{
					name: "channl_1",
					type: "PUBLIC",
					avatar: DefaultChannel
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			)
			console.log("CHANNEL = ", test)
		}
		catch (error) {
			console.log(error)
		}
	}

	async function postChannels() {
		try {
			let i = 0

			while (i < 5)
			{
				let test = await axios.post("http://localhost:3333/channel",
					{
						name: `channl_${i}`,
						type: "PUBLIC",
						avatar: DefaultChannel
					},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				)
				console.log("CHANNEL", i, " = ", test)
				i++
			}
		}
		catch (error) {
			console.log(error)
		}
	}

	async function deleteChannels() {
		try {
			let i = 0

			const channels: AxiosResponse = await axios.get("http://localhost:3333/channel", {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			while (i < channels.data.length)
			{
				console.log("ID = ", channels.data[i].id)
				let test = await axios.delete(`http://localhost:3333/channel/${channels.data[i].id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
					}
				)
				console.log("CHANNEL", i, " = ", test)
				i++
			}
		}
		catch (error) {
			console.log(error)
		}
	}

/* =============================== FRIENDS ================================== */

async function getFriends() {
	try {
		const test: AxiosResponse<User> = await axios.get("http://localhost:3333/friends", {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		console.log("FRIENDS = ", test)

	}
	catch (error) {
		console.log(error)
	}
}

async function postFriend() {
	try {
		const test = await axios.post(`http://localhost:3333/friends/${3}`, {}, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}
		)
		console.log("FRIEND = ", test)
	}
	catch (error) {
		console.log(error)
	}
}

async function deleteFriends() {
	try {
		let i = 0

		const friends: AxiosResponse = await axios.get("http://localhost:3333/friends", {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		while (i < friends.data.length)
		{
			console.log("ID = ", friends.data[i].id)
			let test = await axios.delete(`http://localhost:3333/friends/${friends.data[i].id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
				}
			)
			console.log("FRIEND", i, " = ", test)
			i++
		}
	}
	catch (error) {
		console.log(error)
	}
}


	
	return (
		<Style>

			<Bout onClick={getUsers}>
				get users
			</Bout>
			<Bout onClick={postUser}>
				post user
			</Bout>
			<Bout onClick={postUsers}>
				post users
			</Bout>

			<Bout onClick={getChannel}>
				get channels
			</Bout>
			<Bout onClick={postChannel}>
				post channel
			</Bout>
			<Bout onClick={postChannels}>
				post channels
			</Bout>
			<Bout onClick={deleteChannels}>
				delete channels
			</Bout>

			<Bout onClick={getFriends}>
				get friends
			</Bout>
			<Bout onClick={postFriend}>
				post friend
			</Bout>
			<Bout onClick={deleteFriends}>
				delete friends
			</Bout>



		</Style>
	)
}

export default TestsBack