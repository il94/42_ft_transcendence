import axios from "axios"
import styled from "styled-components"

import DefaultBlackAvatar from "../assets/default_black.png"
import DefaultBlueAvatar from "../assets/default_blue.png"
import DefaultGreenAvatar from "../assets/default_green.png"
import DefaultPinkAvatar from "../assets/default_pink.png"
import DefaultPurpleAvatar from "../assets/default_purple.png"
import DefaultRedAvatar from "../assets/default_red.png"
import DefaultYellowAvatar from "../assets/default_yellow.png"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: absolute;
	top: 30%;
	left: 50%;

	width: 180px;
	height: 180px;

	background-color: #a84152;
	
`

const Bout = styled.button`

	width: 150px;

	height: 50px;

	margin-bottom: 20px;

	color: black;
`


function TestsBack() {


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




	return (
		<Style>

			<Bout onClick={() => axios.get("http://localhost:3333/user")
				.then((response) => {
					console.log(response.data)
				})
				.catch()
			}>
				users get
			</Bout>
			<Bout onClick={() => axios.post("http://localhost:3333/auth/signup",
				{
					username: "user",
					hash: "123456",
					email: "user@test.fr",
					avatar: getRandomDefaultAvatar(),
					phoneNumber: "0000000000"
				})
				.then(response => console.log(response.data))
				.catch(error => console.log(error))
			}>
				post user
			</Bout>

			<Bout onClick={() => {

				let i = 0

				while (i < 5) {
					axios.post("http://localhost:3333/auth/signup",
						{
							username: `friend_${i}`,
							hash: "123456",
							email: `friend_${i}@test.fr`,
							avatar: getRandomDefaultAvatar(),
							phoneNumber: "0000000000"
						})
						.then(response => console.log(response.data))
						.catch(error => console.log(error))
					i++
				}
			}
			}>
				post users
			</Bout>

			<Bout onClick={() => axios.post("http://localhost:3333/auth/signup",
				{
					username: "user",
					hash: "123456",
					email: "user@test.fr",
					avatar: getRandomDefaultAvatar(),
					phoneNumber: "0000000000"
				})
				.then(response => console.log(response.data))
				.catch(error => console.log(error))
			}>
				post user
			</Bout>


			{/*  */}
		</Style>
	)
}

export default TestsBack