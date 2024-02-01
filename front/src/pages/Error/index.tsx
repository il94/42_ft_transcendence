import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Cookies from "js-cookie"

import StyledLink from '../../componentsLibrary/StyledLink/Index'

import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'

import AuthContext from '../../contexts/AuthContext'

import colors from '../../utils/colors'

function Error() {

	const { setToken } = useContext(AuthContext)!
	const location = useLocation()

	useEffect(() => {
		if (location.state?.disconnect)
		{
			localStorage.removeItem("access_token")
			Cookies.remove("access_token")
      Cookies.remove("id")
      Cookies.remove('isNew')
			setToken('')
		}

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