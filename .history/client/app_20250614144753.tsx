import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './routes/home'
import ChatLayout from '@/components/chat-layout'
import Thread from './routes/thread'
import SignIn from './routes/sign-in'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/chat" element={<ChatLayout />}>
					<Route index element={<Home />} />
					<Route path=":threadId" element={<Thread />} />
				</Route>

				<Route path="/sign-in" element={<SignIn />} />
			</Routes>
		</BrowserRouter>
	)
}
