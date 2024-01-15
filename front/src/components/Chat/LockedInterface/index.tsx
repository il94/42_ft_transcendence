import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useState
} from "react"
import axios, { AxiosError } from "axios"

import {
	ErrorMessage,
	Input,
	Style,
	Text
} from "./style"

import Button from "../../../componentsLibrary/Button"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"

import { Channel, UserAuthenticate } from "../../../utils/types"

type PropsLockedInterface = {
	channel: Channel,
	setChannel: Dispatch<SetStateAction<Channel>>,
	setErrorRequest: Dispatch<SetStateAction<boolean>>
}

function LockedInterface({ channel, setChannel, setErrorRequest }: PropsLockedInterface) {

	const { token } = useContext(AuthContext)!

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

	const { userAuthenticate, setUserAuthenticate } = useContext(InteractionContext)!

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

			await axios.post(`http://localhost:3333/channel/join`, {
				id: channel.id,
				password: password.value
			},
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setUserAuthenticate((prevState: UserAuthenticate) => ({
				...prevState,
				channels: [ ...prevState.channels, channel]
			}))

			setChannel(() => ({
				...channel,
				users: [...channel.users, userAuthenticate],
			}))
		}
		catch (error) {
			const axiosError = error as AxiosError

			if (axiosError.response?.status === 403)
			{
				setPassword((prevState) => ({
					...prevState,

					error: true,
					errorMessage: "Invalid password",
				}))
			}
			else
				setErrorRequest(true)
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