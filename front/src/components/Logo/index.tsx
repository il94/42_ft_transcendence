import {
	useState
} from "react"
import {
	useNavigate
} from "react-router-dom"

import {
	LogoFull,
	LogoReduced,
	Style
} from "./style"

import HomeIcon from "../../assets/home.png"
import YellowHomeIcon from "../../assets/yellow_home.png"

type PropsLogo = {
	social: boolean
}

function Logo({ social }: PropsLogo) {

	const navigate = useNavigate()
	const [homeIcon, setHomeIcon] = useState<string>(HomeIcon)
	return (
		<Style onClick={() => navigate("/")}>
			{
				social ?
				<LogoFull tabIndex={0}>
					Transcendence
				</LogoFull>
				:
				<LogoReduced
					onFocus={() => setHomeIcon(YellowHomeIcon)}
					onBlur={() => setHomeIcon(HomeIcon)}
					src={homeIcon}
					tabIndex={0} />
			}
		</Style>
	)
}

export default Logo