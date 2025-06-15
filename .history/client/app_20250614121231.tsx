import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './routes/home'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/chat" element={<ChatLayout />} />
			</Routes>
		</BrowserRouter>
	)
}
