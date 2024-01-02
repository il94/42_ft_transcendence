import { useNavigate } from "react-router-dom"
import { LogoFull, LogoReduced, Style } from "./style"
import HomeIcon from "../../assets/home.png"

type LogoProps = {
	social: boolean
}

function Logo({ social }: LogoProps) {

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