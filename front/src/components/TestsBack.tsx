import axios from "axios"
import styled from "styled-components"

import DefaultBlackProfilePicture from "../assets/default_black.png"
import DefaultBlueProfilePicture from "../assets/default_blue.png"
import DefaultGreenProfilePicture from "../assets/default_green.png"
import DefaultPinkProfilePicture from "../assets/default_pink.png"
import DefaultPurpleProfilePicture from "../assets/default_purple.png"
import DefaultRedProfilePicture from "../assets/default_red.png"
import DefaultYellowProfilePicture from "../assets/default_yellow.png"

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

`


function TestsBack() {


	function getRandomDefaultProfilePicture(): string {

		const defaultProfilePictures: string[] = [
			DefaultBlackProfilePicture,
			DefaultBlueProfilePicture,
			DefaultGreenProfilePicture,
			DefaultPinkProfilePicture,
			DefaultPurpleProfilePicture,
			DefaultRedProfilePicture,
			DefaultYellowProfilePicture
		]

		const randomIndex = Math.floor(Math.random() * defaultProfilePictures.length)

		return (defaultProfilePictures[randomIndex])
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
					avatar: getRandomDefaultProfilePicture(),
					tel: "0000000000"
				})
				.then(response => console.log(response.data))
				.catch(error => console.log(error))
				}>
				post user
			</Bout>

			<Bout onClick={() => {
			
				let i = 0

				while (i < 15)
				{
					axios.post("http://localhost:3333/auth/signup",
					{
						username: `friend_${i}`,
						hash: "123456",
						email: `friend_${i}@test.fr`,
						avatar: getRandomDefaultProfilePicture(),
						tel: "0000000000"
					})
					.then(response => console.log(response.data))
					.catch(error => console.log(error))
					i++
				}
			}
				}>
				post users
			</Bout>


			{/*  */}
		</Style>
	)
}

export default TestsBack