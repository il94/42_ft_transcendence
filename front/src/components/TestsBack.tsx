import axios from "axios"
import styled from "styled-components"

import DefaultRedProfilePicture from "../assets/default_red.png"

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
					username: "sbelabba",
					hash: "123456",
					email: "soso@test.fr",
					avatar: DefaultRedProfilePicture,
					tel: "0000000000"
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