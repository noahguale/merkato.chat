import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './routes/home'
import ChatLayout from '@/components/chat-layout'
import Thread from './routes/thread'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/chat" element={<ChatLayout />}>
					<Route index element={<Home />} />
					<Route path=":threadId" element={<Thread />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
