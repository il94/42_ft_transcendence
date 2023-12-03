import { ChangeEvent, FormEvent, useState } from 'react'
import axios from 'axios'

import {
	SignupPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	TextInput,
	SignupForm,
	Label,
	FTRedirectWrapper,
	Separator,
	Line,
	TextSeparator,
	ErrorMessage
} from './style'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import LinkButtonImage from '../../componentsLibrary/LinkButtonImage'

import colors from '../../utils/colors'

import DefaultBlackAvatar from "../../assets/default_black.png"
import DefaultBlueAvatar from "../../assets/default_blue.png"
import DefaultGreenAvatar from "../../assets/default_green.png"
import DefaultPinkAvatar from "../../assets/default_pink.png"
import DefaultPurpleAvatar from "../../assets/default_purple.png"
import DefaultRedAvatar from "../../assets/default_red.png"
import DefaultYellowAvatar from "../../assets/default_yellow.png"
import FTButton from "../../assets/42.png"

function Signup() {

	const [errorMessage, setErrorMessage] = useState('')
	const [inputUsername, setInputUsername] = useState('')
	const [inputPassword, setInputPassword] = useState('')

	function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()

		axios.post("http://localhost:3333/auth/signup",
		{
			username: inputUsername,
			hash: inputPassword,
			email: `${inputUsername}_test@test.fr`,
			avatar: getRandomDefaultAvatar(),
			tel: "0000000000"
		})
		.then((response) => console.log(response))
		.catch((error) => console.log(error))

	}

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

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

		const { name, value } = event.target

		if (name === "username")
		{
			if (value.length > 8 )
				setErrorMessage("Username must be 8 characters max")
			else if (!/^[a-zA-Z0-9-_.]*$/.test(value))
				setErrorMessage("Username can't contain special characters")
			else
			{
				setInputUsername(value)
				setErrorMessage('')
			}
		}
		else
			setInputPassword(value.replace(/\./g, '*'))
	}

	return (
		<SignupPage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Sign up
				</StyledTitle>
				<SignupForm onSubmit={handleSubmit} autoComplete="off" spellCheck="false" >
					<Label>
						Username
						<TextInput type="text" onChange={handleInputChange}
							name="username" value={inputUsername} />
					</Label>
					<Label>
						Password
						<TextInput type="password" onChange={handleInputChange}
							name="password" value={inputPassword} />
					</Label>
						<ErrorMessage>
							{errorMessage}
						</ErrorMessage>
					<div style={{ marginTop: "10px" }} />
					<Button type="submit" fontSize={35}>
						Continue
					</Button>
				</SignupForm>
				<div>
					Already have an account ?&nbsp;
					<StyledLink to="/signin" color={colors.button}>
						Sign in
					</StyledLink>
				</div>
				<Separator>
					<Line />
					<TextSeparator>
						OR
					</TextSeparator>
					<Line />
				</Separator>
				<FTRedirectWrapper>
					<LinkButtonImage to="http://localhost:3333/auth/api42/login">
						<img src={FTButton} style={{ paddingRight: "7px"}} />
						Continue with 42
					</LinkButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</SignupPage>
	)
}

export default Signup
