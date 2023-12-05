import { ChangeEvent, FormEvent, useState } from 'react'

import {
	SigninPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	TextInput,
	SigninForm,
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

import FTButton from "../../assets/42.png"
import axios from 'axios'

function Signin() {

	const [errorMessage, setErrorMessage] = useState('')
	const [inputUsername, setInputUsername] = useState('')
	const [inputPassword, setInputPassword] = useState('')

	function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()

		axios.post("http://localhost:3333/auth/signin",
		{
			username: inputUsername,
			hash: inputPassword,
			email: `${inputUsername}_test@test.fr` // a retirer
		})
		.then((response) => console.log(response))
		.catch((error) => console.log(error))

	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

		const { name, value } = event.target

		if (name === "username") {
			if (value.length > 8)
				setErrorMessage("Username must be 8 characters max")
			else if (!/^[a-zA-Z0-9-_.]*$/.test(value))
				setErrorMessage("Username can't contain special characters")
			else {
				setInputUsername(value)
				setErrorMessage('')
			}
		}
		else
			setInputPassword(value.replace(/\./g, '*'))
	}

	return (
		<SigninPage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Sign in
				</StyledTitle>
				<SigninForm onSubmit={handleSubmit} autoComplete="off" spellCheck="false">
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
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</SigninForm>
				<div>
					Don't have an account?&nbsp;
					<StyledLink to="/signup" color={colors.button}>
						Sign up
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
						<img src={FTButton} style={{ paddingRight: "7px" }} />
						Continue with 42
					</LinkButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</SigninPage>
	)
}

export default Signin