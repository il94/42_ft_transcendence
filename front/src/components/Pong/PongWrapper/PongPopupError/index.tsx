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

import Icon from "../../../../componentsLibrary/Icon"
import ActiveText from "../../../../componentsLibrary/ActiveText/Index"


import colors from "../../../../utils/colors"

import CloseIcon from "../../../../assets/close.png"

type PropsPongPopupError = {
	displayPongPopupError: Dispatch<SetStateAction<{ display: boolean, message?: string }>>,
	message?: string
}

function PongPopupError({ displayPongPopupError, message } : PropsPongPopupError) {

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
			displayPongPopupError({ display: false, message: undefined })
		}
	}, [timer])

	function handleReloadClickText() {
		window.location.reload()
	}

	return (
		<Style>
			<CloseButton>
				<Icon onClick={() => displayPongPopupError({ display: false, message: undefined })}
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
					<div style={{ height: "5px"}} />
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

export default PongPopupError