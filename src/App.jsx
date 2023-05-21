import { RegisterAndLogin } from "./components";
import axios from "axios";
import { UserContextProvider, UserContext } from "./contexts/UserContext";
import "./App.css"
function App() {
	axios.defaults.baseURL = "http://localhost:3000";
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
