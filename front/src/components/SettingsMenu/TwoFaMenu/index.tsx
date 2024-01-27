import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { Style } from "./style"
import axios from "axios"
import AuthContext from "../../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

type PropsTwoFaMenu = {
	twoFAcodeQR: string
}

function TwoFaMenu({ twoFAcodeQR } : PropsTwoFaMenu) {

	const { token, url } = useContext(AuthContext)!
	const navigate = useNavigate()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			// empecher cette requete si 2fa deja enable 
			const response = await axios.patch(`http://${url}:3333/auth/2fa/enable`, {
				twoFACode: code
			},
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			console.log("/2fa/enable response = ", response.data)
			navigate("/game")

		}
		catch (error) {

			console.log(error)
		}
	}


	function handleInputCodeChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value

		setCode(value)
	}


	const [code, setCode] = useState<string>('')

	return (
		<Style>
			<form
				onSubmit={handleSubmit}>

				<img src={twoFAcodeQR} />

				<input
					type="text"
					onChange={handleInputCodeChange}
					value={code}
					style={{ backgroundColor: "black" }}

					
					/>
			</form>
		</Style>
	)
}

export default TwoFaMenu