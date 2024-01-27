import { useNavigate } from "react-router-dom"
import { LogoFull, LogoReduced, Style } from "./style"
import HomeIcon from "../../assets/home.png"

type PropsLogo = {
	social: boolean
}

function Logo({ social }: PropsLogo) {

	const navigate = useNavigate()

	return (
		<Style onClick={() => navigate("/")}>
			{
				social ?
				<LogoReduced src={HomeIcon} />
				:
				<LogoFull>
					Transcendence
				</LogoFull>
			}
		</Style>
	)
}

export default Logo