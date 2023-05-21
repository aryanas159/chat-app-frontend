import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import logo from '../../assets/logo.png'
import user from "../../assets/user.png";
import passwordLogo from '../../assets/password.png'

const Register = ({ handleRegisterOrLogin, msg, handleMsgChange  }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { setUsername: setLoginUsername, setId } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		const response = await axios.post("/register", { username, password });
		handleMsgChange("Successfully registered")
		handleRegisterOrLogin("login");
		} catch(err) {
			console.log(err)
			if(err.response.status == 409) {
				handleMsgChange(err.response.data.message)
			}
		}
	};
	return (
		<div className="form__container">
				<img src={logo} alt="logo" className="form__logo"/>
			
			<form onSubmit={handleSubmit}>
				<div className="form__input-div">
					<label htmlFor="username">
						<img src={user} alt="user" />
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
					<img src={passwordLogo} alt="passwordLogo" />
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
					Register
				</button>
				<div className="form__redirect-div">
					Already have an account?
					<button onClick={() => handleRegisterOrLogin("login")} className="form__redirect-button">
						Login here
					</button>
				</div>
			</form>
		</div>
	);
};
export default Register;
