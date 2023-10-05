import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import GlobalStyle from './utils/GlobalStyle'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<GlobalStyle />
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/game" element={<Game />} />
				</Routes>
			</Router>
	</React.StrictMode>,
)
