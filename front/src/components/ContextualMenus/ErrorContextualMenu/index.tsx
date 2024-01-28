import {
	Dispatch,
	SetStateAction,
	useEffect,
	useState
} from "react"

import {
	CloseButton,
	MessageError,
	Style
} from "./style"

import Icon from "../../../componentsLibrary/Icon"
import ActiveText from "../../../componentsLibrary/ActiveText/Index"

import CloseIcon from "../../../assets/close.png"

import colors from "../../../utils/colors"

type PropsErrorContextualMenu = {
	displayErrorContextualMenu: Dispatch<SetStateAction<boolean>>
}

function ErrorContextualMenu({ displayErrorContextualMenu }: PropsErrorContextualMenu) {

	const [timer, setTimer] = useState<number>(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prevState) => prevState + 1)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		if (timer >= 5) {
			displayErrorContextualMenu(false)
		}
	}, [timer])

	function handleReloadClickText() {
		window.location.reload()
	}

	return (
		<Style>
			<CloseButton>
				<Icon onClick={() => displayErrorContextualMenu(false)}
					src={CloseIcon} size={22}
					alt="Close button" title="Close" />
			</CloseButton>
			<MessageError>
				An error has occurred. <br />
				Please try again or reload your browser.
			</MessageError>
			<ActiveText
				onClick={handleReloadClickText}
				color={colors.button}>
				Reload
			</ActiveText>
		</Style>
	)
}

export default ErrorContextualMenu