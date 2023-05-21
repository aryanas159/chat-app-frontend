import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import logo from "../../assets/logo.png";
import user from "../../assets/user.png";
import passwordLogo from "../../assets/password.png";

const Login = ({ handleRegisterOrLogin, msg, handleMsgChange }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { setUsername: setLoginUsername, setId } = useContext(UserContext);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/login", { username, password });
		setLoginUsername(username);
		setId(response.data._id);
		} catch (err) {
			if(err.response.status == 404) {
				handleMsgChange(err.response.data.message)
			}
			else 
			if(err.response.status == 401) {
				handleMsgChange(err.response.data.message)
			}
		}
	};
	return (
		<div className="form__container">
			<img src={logo} alt="logo" className="form__logo" />
			<form onSubmit={handleLogin}>
				<div className="form__input-div">
					<label htmlFor="username">
						<img src={user} alt="user" height={20} />
					</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						name="username"
						className="form__input-username"
						placeholder="Username"
						required
					/>
				</div>
				<div className="form__input-div">
					<label htmlFor="password">
						<img src={passwordLogo} alt="password" />
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						name="password"
						className="form__input-password"
						placeholder="Password"
						required
					/>
				</div>
				<div className={"form__error-message" + (msg.includes("Success") ? " success" : "")}>
					{msg}
				</div>
				<button type="submit" className="form__submit-button">
					Login
				</button>
				<div className="form__redirect-div">
					Don't have an account?
					<button
						onClick={() => handleRegisterOrLogin("register")}
						className="form__redirect-button"
					>
						Register here
					</button>
				</div>
			</form>
		</div>
	);
};
export default Login;
