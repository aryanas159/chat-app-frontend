import {useState, useEffect, createContext} from 'react'
import axios from 'axios'

const UserContext = createContext({})

const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState('')
    const [id, setId] = useState('')
    useEffect(() => {
        axios.get('/profile')
        .then(res => {
            setUsername(res.data.username)
            setId(res.data.id)
        })
    }, [])
    
    return (
        <>
            <UserContext.Provider value={{username, setUsername, id, setId}}>
                {children}
            </UserContext.Provider>
        </>
    )
}

export { UserContextProvider, UserContext};