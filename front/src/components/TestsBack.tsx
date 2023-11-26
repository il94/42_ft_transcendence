import axios from "axios"
import styled from "styled-components"

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

			<Bout onClick={() => axios.get("http://localhost:3333/users")
				.then((response) => {
					console.log(response.data)
				})
				.catch()
			}>
				users get
			</Bout>
			<Bout onClick={() => axios.post("http://localhost:3333/users",
				{
					username: "ilandols",
					hash: "123456",
					email: "ilyes@test.fr",
					profilePicture: "image"
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