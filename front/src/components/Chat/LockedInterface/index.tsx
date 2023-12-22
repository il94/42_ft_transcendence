import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from "react"
// import axios from "axios"

import { ErrorMessage, Input, Style, Text } from "./style"

import Button from "../../../componentsLibrary/Button"

import { ChannelData } from "../../../utils/types"
import GlobalContext from "../../../contexts/GlobalContext"
import { chatWindowStatus } from "../../../utils/status"

type PropsLockedInterface = {
	channelTarget: ChannelData,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>
}

function LockedInterface({ channelTarget, setChatWindowState }: PropsLockedInterface) {

	type PropsSetting = {
		value: string,
		error: boolean,
		errorMessage?: string
	}

	const [password, setPassword] = useState<PropsSetting>({
		value: '',
		error: false,
		errorMessage: ''
	})

	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setPassword({
			value: value,
			error: false
		})
	}

	const { userAuthenticate } = useContext(GlobalContext)!

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (password.value.length === 0) {
				setPassword({
					value: '',
					error: true,
					errorMessage: "Insert password",
				})
				return
			}

			if (password.value === channelTarget.password) {
				/* ============ Temporaire ============== */

				// await axios.post("http://localhost:3333/channel/:id/validusers/:id", userAuthenticate)

				/* ====================================== */

				channelTarget.validUsers.push(userAuthenticate)
				setChatWindowState(chatWindowStatus.CHANNEL)
			}
			else {
				setPassword((prevState) => ({
					...prevState,

					error: true,
					errorMessage: "Invalid password",
				}))
			}
		}
		catch (error) {

		}
	}

	return (
		<Style
			onSubmit={handleSubmit}
			autoComplete="off"
			spellCheck="false">
			<Text>
				Password
			</Text>
			<Input
				onChange={handleInputPasswordChange}
				value={password.value as string}
				$error={password.error} />
			<ErrorMessage>
				{password.error && password.errorMessage}
			</ErrorMessage>
			<Button
				type="submit" width={200}
				alt="Submit button" title="Submit">
				Submit
			</Button>

		</Style>
	)
}

export default LockedInterface