import { useEffect } from 'react'
import Cookies from "js-cookie"

import StyledLink from '../../componentsLibrary/StyledLink/Index'

import colors from '../../utils/colors'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'

function Error() {

	useEffect(() => {
		localStorage.removeItem("access_token")
		Cookies.remove("access_token")
	}, [])

	return (
		<Page>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<WindowTitle>
					Error
				</WindowTitle>
				An error has occurred
				<div style={{ height: "10px" }} />
				<StyledLink to="/" color={colors.button}>
					Home
				</StyledLink>
				<div style={{ height: "10px" }} />
			</CentralWindow>
		</Page>
	)
}

export default Error