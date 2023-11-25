import {
	SignupPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	StyledLink,
	TextInput,
	SignupForm,
	Label,
	Button,
	FTRedirectWrapper,
	ButtonImage,
	Image,
	Separator,
	Line,
	TextSeparator
} from './style'

import FTButton from "../../assets/42.png"

import colors from '../../utils/colors'

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
						<Image src={FTButton} />
						Continue with 42
					</ButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</SignupPage>
	)
}

export default Signup
