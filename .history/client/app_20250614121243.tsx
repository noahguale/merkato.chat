import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './routes/home'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/chat" element={<ChatLayout />}>
					<Route path="/" element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
