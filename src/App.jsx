import { RegisterAndLogin } from "./components";
import axios from "axios";
import { UserContextProvider, UserContext } from "./contexts/UserContext";
import "./App.css"
function App() {
	axios.defaults.baseURL = "https://mern-chat-api-4ml5.onrender.com";
	axios.defaults.withCredentials = true;

	return (
		<>
			<UserContextProvider>
				<RegisterAndLogin/>
			</UserContextProvider>
		</>
	);
}

export default App;
