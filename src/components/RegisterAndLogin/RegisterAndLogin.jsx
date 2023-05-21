import { useState, useContext } from "react";
import Login from "./Login";
import Register from "./Register";
import {UserContext} from '../../contexts/UserContext'
import Chat from '../Chat/Chat'
import "./RegisterAndLogin.css"

const RegisterOrLogin = () => {
    const [registerOrLogin, setRegisterOrLogin] = useState('register')
    const [msg, setMsg] = useState("")
    const {username, id} = useContext(UserContext)
    const handleMsgChange = (m) => {
        return setMsg(m)
    }
    const handleRegisterOrLogin = (str) => {
        return setRegisterOrLogin(str);
    };
    if(username){
        return (
            <>
                <Chat />
            </>
        )
    }

	return (
		<div className="register-and-login__main">
            {registerOrLogin === "register" ? (
				<Register handleRegisterOrLogin={handleRegisterOrLogin} msg={msg} handleMsgChange={handleMsgChange}/>
			) : (
				<Login handleRegisterOrLogin={handleRegisterOrLogin} msg={msg} handleMsgChange={handleMsgChange}/>
			)}
            </div>
	);
};
export default RegisterOrLogin;
