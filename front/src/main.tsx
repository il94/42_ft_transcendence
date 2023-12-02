import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Error from './pages/Error'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/game" element={<Game />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</Router>
	</React.StrictMode>,
)
