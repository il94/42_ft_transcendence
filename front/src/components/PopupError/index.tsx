import {
	useContext,
	useEffect,
	useState
} from "react"

import {
	CloseButton,
	MessageError,
	Style
} from "./style"

import Icon from "../../componentsLibrary/Icon"
import ActiveText from "../../componentsLibrary/ActiveText/Index"

import DisplayContext from "../../contexts/DisplayContext"

import colors from "../../utils/colors"

import CloseIcon from "../../assets/close.png"

type PropsPopupError = {
	message?: string
}

function PopupError({ message } : PropsPopupError) {

	const { displayPopupError } = useContext(DisplayContext)!

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
			displayPopupError({ display: false, message: undefined })
		}
	}, [timer])

	function handleReloadClickText() {
		window.location.reload()
	}

	return (
		<Style>
			<CloseButton>
				<Icon onClick={() => displayPopupError({ display: false, message: undefined })}
					src={CloseIcon} size={22}
					alt="Close button" title="Close" />
			</CloseButton>
			{
				message ?
				<MessageError>
					{message}
				</MessageError>
				:
				<>
					<MessageError>
						An error has occurred. <br />
						Please try again or reload your browser.
					</MessageError>
					<ActiveText
						onClick={handleReloadClickText}
						color={colors.button}>
						Reload
					</ActiveText>
				</>
			}
		</Style>
	)
}

export default PopupError