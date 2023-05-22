import { useContext, useEffect, useState, useRef } from "react";
import "./Chat.css";
import User from "./User";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import attachmentIcon from "../../assets/attachment.svg";
import userWhite from "../../assets/user-white.png";
import logo from "../../assets/logo.png";
import send from "../../assets/send.png";
import hamburger from "../../assets/hamburger.png";
import attachmentWhite from "../../assets/attachment-white.png";
import arrow from '../../assets/arrow.png'
const imgExt = ["png", "jpg", "jpeg", "webp"];
const Chat = () => {
	const [ws, setWs] = useState("");
	const { id, username, setId, setUsername } = useContext(UserContext);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [newMessageText, setNewMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const [offlineUsers, setOfflineUsers] = useState({});
	const [isFileBig, setIsFileBig] = useState(false);
	const [windowsDimensions, setWindowsDimensions] = useState({
		width: window.visualViewport.width,
		height: window.visualViewport.height,
	});
	const bottomRef = useRef(null);
	const mobileViewWidth = 500;
	const [isMobileView, setIsMobileView] = useState(windowsDimensions.width < mobileViewWidth);
	const [toggleSidebar, setToggleSidebar] = useState(false)
	const MAX_SIZE = 50 * 1024 * 1024;
	const handleMessages = (e) => {
		const userData = JSON.parse(e.data);
		if ("online" in userData) {
			const usersArray = userData.online;
			const usersObject = {};
			usersArray.forEach((user) => (usersObject[user.id] = user.username));
			setOnlineUsers(usersObject);
		} else if ("message" in userData) {
			if (userData.message.sender === selectedUserId) {
				setMessages((prev) => [
					...prev,
					{
						text: userData.message.text,
						file: userData.message.file,
						receipient: userData.message.receipient,
						sender: userData.message.sender,
						_id: userData.message._id,
					},
				]);
			}
		}
	};
	const duplicateMessagesExcluded = [];
	messages.forEach((msg) => {
		let msgId = msg._id;
		if (!msgId) {
			duplicateMessagesExcluded.push(msg);
		} else {
			const duplicate = duplicateMessagesExcluded.find(
				(msg) => msg._id === msgId
			);
			if (!duplicate) {
				duplicateMessagesExcluded.push(msg);
			}
		}
	});
	const sendMessage = (e) => {
		e.preventDefault();
		if (selectedUserId && newMessageText !== "") {
			ws.send(
				JSON.stringify({
					sender: id,
					receipient: selectedUserId,
					text: newMessageText,
				})
			);
			setMessages((prev) => [
				...prev,
				{
					text: newMessageText,
					sender: id,
					receipient: selectedUserId,
					file: null,
					_id: Date.now(),
				},
			]);
			setNewMessageText("");
		}
	};
	const sendFile = (e) => {
		const reader = new FileReader();
		const fileData = e.target.files[0];
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = () => {
			const parts = fileData.name.split(".");
			const ext = parts[parts.length - 1];
			let fileName = Date.now() + "." + ext;
			if (reader.result.length <= MAX_SIZE) {
				ws.send(
					JSON.stringify({
						sender: id,
						receipient: selectedUserId,
						file: {
							name: fileName,
							data: reader.result,
						},
					})
				);
			} else {
				console.log("big file");
				setIsFileBig(true);
				setTimeout(() => {
					setIsFileBig(false);
				}, 3000);
			}
			setTimeout(() => {
				axios.get(`/messages/${selectedUserId}`).then((res) => {
					setMessages(res.data);
				});
			}, 100);
		};
	};

	const connectToWs = () => {
		const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
		setWs(ws);
		console.log(ws)
		ws.addEventListener('open', () => {console.log('opened')})
		ws.addEventListener("message", handleMessages);
		ws.addEventListener("close", connectToWs); // automatically reconnects to the web socket
	};
	const handleResize = () => {
		setWindowsDimensions({
			width: window.visualViewport.width,
			height: window.visualViewport.height,
		});
	};
	useEffect(connectToWs, [selectedUserId]);
	useEffect(() => {
		window.addEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		setIsMobileView(windowsDimensions.width < mobileViewWidth);
	}, [windowsDimensions]);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	useEffect(() => {
		if (!!selectedUserId) {
			axios.get(`/messages/${selectedUserId}`).then((res) => {
				setMessages(res.data);
			});
		}
	}, [selectedUserId]);
	useEffect(() => {
		axios.get("/people").then((res) => {
			const usersArray = res.data;

			const offlineUsersArray = usersArray.filter((user) => {
				return !Object.keys(onlineUsers).includes(user._id);
			});
			const offlineUsersObj = {};
			offlineUsersArray.forEach((user) => {
				offlineUsersObj[user._id] = user.username;
			});
			setOfflineUsers(offlineUsersObj);
		});
	}, [onlineUsers]);
	const handleLogout = async () => {
		await axios.post("/logout");
		setId(null);
		setUsername(null);
		setWs(null);
		location.reload();
	};
	const Contacts = () => {
		return (
			<div className="chat__contacts-and-profile">
					<div className="chat__title">
						<img src={logo} alt="logo" />
						<div className="chat__title-text">MERN CHAT</div>
					</div>
					<div className="chat__contacts">
						{Object.keys(onlineUsers).map((userId) => {
							if (userId !== id) {
								return (
									<div onClick={() => {
										setSelectedUserId(userId)
										setToggleSidebar(false)
										}} key={userId}>
										<User
											id={userId}
											username={onlineUsers[userId]}
											selected={selectedUserId === userId}
											online={true}
										/>
									</div>
								);
							}
						})}
						{Object.keys(offlineUsers).map((userId) => {
							if (userId !== id) {
								return (
									<div onClick={() => {
										setSelectedUserId(userId)
										setToggleSidebar(false)
									}} key={userId}>
										<User
											id={userId}
											username={offlineUsers[userId]}
											selected={selectedUserId === userId}
											online={false}
										/>
									</div>
								);
							}
						})}
					</div>
					<div className="chat__profile">
						<div className="username">
							<img src={userWhite} alt="user" />
							{username}
						</div>
						<button onClick={handleLogout}>Logout</button>
					</div>
				</div>
		)
	}
	const Messages = () => {
		return (
			duplicateMessagesExcluded.map((message) => {
				return (
					<div
						className={
							"chat__chatbox__messages__message" +
							(message.sender === id ? " mine" : "")
						}
						key={message._id}
					>
						{message.file ? (
							<a
								target="_blank"
								href={axios.defaults.baseURL + "/uploads/" + message.file}
							>
								<div className="file__name">
									{message.file}
									<img
										src={attachmentWhite}
										alt="attachment"
										className="attachment-icon"
									/>
								</div>
								{imgExt.includes(
									message.file.split(".")[
										message.file.split(".").length - 1
									]
								) ? (
									<img
										src={
											axios.defaults.baseURL + "/uploads/" + message.file
										}
										alt="image"
										className="image-sent"
									/>
								) : (
									<></>
								)}
							</a>
						) : (
							<p>{message.text}</p>
						)}
					</div>
				);
			})
		)
	}
	return (
		<div className="chat">
			{!isMobileView ? (
				<Contacts />
			) : (
				<div className="chat__sidebar">
					<button className="chat__sidebar__toggle-button" onClick={() => {setToggleSidebar(prev => !prev)}}>
						<img src={hamburger} alt="Toggle" className="hamburger-icon"/>
					</button>
					{toggleSidebar ? <Contacts />: <></>}
				</div>
			)}
			<div className="chat__chatbox">
				<div className="chat__chatbox__messages">

					{
						!!selectedUserId ? <Messages /> : <div className="chat__chatbox__empty"><img src={arrow} alt="arrow" /> Select a user to get started</div>
					}
					<div className="err-message">
						{isFileBig ? <>Files larger than 50mb can't be sent</> : <></>}
					</div>
					<div className="bottom-div" ref={bottomRef}></div>
				</div>

				<div className="chat__chatbox__input-div">
					{!!selectedUserId ? (
						<form onSubmit={sendMessage} className="chat__chatbox__input">
							<input
								type="text"
								placeholder="Type your message here"
								value={newMessageText}
								onChange={(e) => setNewMessageText(e.target.value)}
								className="chat__text-input"
							/>
							<label className="form__label-attachments">
								<img src={attachmentIcon} />
								<input
									type="file"
									className="form__attachments"
									onChange={sendFile}
								/>
							</label>
							<button type="submit" className="chatbox__send-button">
								{" "}
								<img src={send} alt="send" />{" "}
							</button>
						</form>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};
export default Chat;

// /* CSV */
// 050505,554965,050505,01CAFE,202020,1F1F1F,223F79,1C1C1C,040404,CC02FF

// /* With # */
// #050505, #554965, #050505, #01CAFE, #202020, #1F1F1F, #223F79, #1C1C1C, #040404, #CC02FF

// /* Array */
// ["050505","554965","050505","01CAFE","202020","1F1F1F","223F79","1C1C1C","040404","CC02FF"]

// /* Object */
// {"Black":"050505","English Violet":"554965","Black 2":"050505","Vivid sky blue":"01CAFE","Eerie black":"202020","Eerie black 2":"1F1F1F","Yale Blue":"223F79","Eerie black 3":"1C1C1C","Black 3":"040404","Electric purple":"CC02FF"}

// /* Extended Array */
// [{"name":"Black","hex":"050505","rgb":[5,5,5],"cmyk":[0,0,0,98],"hsb":[0,0,2],"hsl":[0,0,2],"lab":[1,0,0]},{"name":"English Violet","hex":"554965","rgb":[85,73,101],"cmyk":[16,28,0,60],"hsb":[266,28,40],"hsl":[266,16,34],"lab":[33,11,-14]},{"name":"Black","hex":"050505","rgb":[5,5,5],"cmyk":[0,0,0,98],"hsb":[0,0,2],"hsl":[0,0,2],"lab":[1,0,0]},{"name":"Vivid sky blue","hex":"01CAFE","rgb":[1,202,254],"cmyk":[100,20,0,0],"hsb":[192,100,100],"hsl":[192,99,50],"lab":[76,-24,-37]},{"name":"Eerie black","hex":"202020","rgb":[32,32,32],"cmyk":[0,0,0,87],"hsb":[0,0,13],"hsl":[0,0,13],"lab":[12,0,0]},{"name":"Eerie black","hex":"1F1F1F","rgb":[31,31,31],"cmyk":[0,0,0,88],"hsb":[0,0,12],"hsl":[0,0,12],"lab":[12,0,0]},{"name":"Yale Blue","hex":"223F79","rgb":[34,63,121],"cmyk":[72,48,0,53],"hsb":[220,72,47],"hsl":[220,56,30],"lab":[28,10,-36]},{"name":"Eerie black","hex":"1C1C1C","rgb":[28,28,28],"cmyk":[0,0,0,89],"hsb":[0,0,11],"hsl":[0,0,11],"lab":[10,0,0]},{"name":"Black","hex":"040404","rgb":[4,4,4],"cmyk":[0,0,0,98],"hsb":[0,0,2],"hsl":[0,0,2],"lab":[1,0,0]},{"name":"Electric purple","hex":"CC02FF","rgb":[204,2,255],"cmyk":[20,99,0,0],"hsb":[288,99,100],"hsl":[288,100,50],"lab":[52,91,-75]}]

// /* XML */
// <palette>
//   <color name="Black" hex="050505" r="5" g="5" b="5" />
//   <color name="English Violet" hex="554965" r="85" g="73" b="101" />
//   <color name="Black" hex="050505" r="5" g="5" b="5" />
//   <color name="Vivid sky blue" hex="01CAFE" r="1" g="202" b="254" />
//   <color name="Eerie black" hex="202020" r="32" g="32" b="32" />
//   <color name="Eerie black" hex="1F1F1F" r="31" g="31" b="31" />
//   <color name="Yale Blue" hex="223F79" r="34" g="63" b="121" />
//   <color name="Eerie black" hex="1C1C1C" r="28" g="28" b="28" />
//   <color name="Black" hex="040404" r="4" g="4" b="4" />
//   <color name="Electric purple" hex="CC02FF" r="204" g="2" b="255" />
// </palette>
