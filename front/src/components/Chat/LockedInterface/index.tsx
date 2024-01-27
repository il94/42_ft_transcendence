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

import {
	UserAuthenticate
} from "../../../utils/types"

type PropsLockedInterface = {
	setErrorRequest: Dispatch<SetStateAction<boolean>>
}

function LockedInterface({ setErrorRequest }: PropsLockedInterface) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

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

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (!channelTarget)
				throw new Error

			if (password.value.length === 0) {
				setPassword({
					value: '',
					error: true,
					errorMessage: "Insert password",
				})
				return
			}

			await axios.post(`http://${url}:3333/channel/join/${channelTarget.id}`, {
				password: password.value
			},
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setUserAuthenticate((prevState: UserAuthenticate) => ({
				...prevState,
				channels: [ ...prevState.channels, channelTarget]
			}))

			setChannelTarget(() => ({
				...channelTarget,
				members: [...channelTarget.members, userAuthenticate],
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