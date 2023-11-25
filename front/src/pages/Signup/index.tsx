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
	TextSeparator
} from './style'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import ButtonImage from '../../componentsLibrary/ButtonImage'

import colors from '../../utils/colors'

import FTButton from "../../assets/42.png"

function Signup() {
	return (
		<SignupPage>
			<MainTitle>
				<StyledLink to="/" color={colors.text}>
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Sign up
				</StyledTitle>
				<SignupForm>
					<Label>
						Username
						<TextInput type="text" />
					</Label>
					<Label>
						Password
						<TextInput type="text" />
					</Label>
					<div style={{ marginTop: "10px" }} />
					<Button>
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
					<ButtonImage>
						<img src={FTButton} style={{ paddingRight: "7px"}} />
						Continue with 42
					</ButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</SignupPage>
	)
}

export default Signup
