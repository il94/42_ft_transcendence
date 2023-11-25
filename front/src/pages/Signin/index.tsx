import {
	SigninPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	StyledLink,
	TextInput,
	SigninForm,
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

function Signin() {
	return (
		<SigninPage>
			<MainTitle>
				<StyledLink to="/" color={colors.text}>
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Sign in
				</StyledTitle>
				<SigninForm>
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
					<ButtonImage>
						<Image src={FTButton} />
						Continue with 42
					</ButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</SigninPage>
	)
}

export default Signin