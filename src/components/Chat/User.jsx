import './Chat.css'
const bgColor = ['#FFD1DC', '#ADD8E6', '#98FF98', '#E6E6FA', '#FFDAB9', '#FFFFE0', '#AEC6CF', '#98FB98', '#C8A2C8', '#FFE4B5']
const User = ({id, username, selected, online}) => {
    const colorId = parseInt(id, 16) % bgColor.length
    return (
        <div className={"user" + (selected ? " selected" : '')}>
            <div className="user__avatar" style={{backgroundColor: bgColor[colorId]}}>
                {online ? <div className="user__online-indicator"></div> : <></>}
                {username[0].toUpperCase()}
            </div>
            <div className="user__username">{username}</div>
        </div>
    )
}
export default User;