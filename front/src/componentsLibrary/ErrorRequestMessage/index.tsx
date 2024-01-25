import { useEffect } from "react"
import styled from "styled-components"

import Cookies from "js-cookie"

const ErrorMessage = styled.p`
	// A custom
`

type PropsErrorRequestMessage = {
	errorMessage?: string | undefined
}

function ErrorRequestMessage({ errorMessage } : PropsErrorRequestMessage) {

	useEffect(() => {
		localStorage.removeItem("access_token")
		Cookies.remove("access_token")
	}, [])

	return (
		<ErrorMessage>
			{
				errorMessage ?
				<p>
					{errorMessage}
				</p>
				:
				<p>
					An error has occurred. Please log in again
				</p>
			}
		</ErrorMessage>
	)
}

export default ErrorRequestMessage