import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import TwoFA from './pages/twoFA'
import Error from './pages/Error'

import AuthContext from './contexts/AuthContext'

function App() {

	const localToken = localStorage.getItem('token')
	const [token, setToken] = useState<string>(localToken ? localToken : '')
	const url = new URL(window.location.href).hostname

	return (
		<AuthContext.Provider value={{ token, setToken, url }}>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/twofa" element={<TwoFA />} />
					<Route path="/game" element={<Game />} />
					<Route path="*" element={<Error />} />
				</Routes>
			</Router>
		</AuthContext.Provider>
	)
}

export default App