import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { Style } from "./style"
import axios from "axios"
import AuthContext from "../../../contexts/AuthContext"

type PropsTwoFaMenu = {
	twoFAcodeQR: string
}

function TwoFaMenu({ twoFAcodeQR } : PropsTwoFaMenu) {

	const { token, url } = useContext(AuthContext)!

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			console.log("TWOFA SUBMIT")
			console.log("VALUE", code)


			const response = await axios.patch(`http://${url}:3333/auth/2fa/enable`, {
				twoFACode: code
			},
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			console.log("RESPONSE = ", response)

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