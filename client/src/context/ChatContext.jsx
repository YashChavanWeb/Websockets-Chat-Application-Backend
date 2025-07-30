import { createContext, useCallback, useEffect, useState } from "react";
import { baseURL, getRequest, postRequest } from "../utils/services";
// socket connection 
import { io } from 'socket.io-client'

export const ChatContext = createContext()


export const ChatContextProvider = ({ children, user }) => {

    // rendering user chats
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)

    // rendering all users
    const [potentialChats, setPotentialChats] = useState([])
    const [allUsers, setAllUsers] = useState([])

    // get the current user clicked chat
    const [currentChat, setCurrentChat] = useState(null)

    // get the current chat clicked messages
    const [messages, setMessages] = useState(null)
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    const [messageError, setMessageError] = useState(null)

    // sending messages
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)

    // socket state
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    // notifications
    const [notifications, setNotifications] = useState([])


    console.log('Notifications: ', notifications)


    // ------------------------ Use Effects ------------------------

    // get user chats when the context loads
    useEffect(() => {
        const getUserChats = async () => {

            setIsUserChatsLoading(true)
            setUserChatsError(null)


            if (user?._id) {
                const response = await getRequest(`${baseURL}/chats/${user._id}`)
                setIsUserChatsLoading(false)

                if (!response.error) {
                    return setUserChats(response)
                } else {
                    setUserChatsError(response)
                }
            }
        }

        getUserChats()

    }, [user])

    // get the potential chats 
    useEffect(() => {

        const getAllUsers = async () => {

            const response = await getRequest(`${baseURL}/users`)

            if (response.error) return console.log("Error fetching users ", response)

            // perform filtering on the chats
            const pChats = response.filter((currUser) => {

                let isChatCreated = false

                // exclude the currently logged in user
                if (user?._id === currUser?._id) return false

                // already have chat created 
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === currUser._id || chat.members[1] === currUser._id

                    })
                }
                return !isChatCreated;


            })

            setPotentialChats(pChats)
            setAllUsers(response)
        }

        getAllUsers()


    }, [userChats])


    // get the messages of a chat
    useEffect(() => {
        const getMessages = async () => {

            setIsMessageLoading(true);
            setMessageError(null);

            const response = await getRequest(`${baseURL}/messages/${currentChat?._id}`);
            setIsMessageLoading(false);

            if (response.error) {
                return setMessageError(response);
            } else {
                setMessages(response);
            }
        };

        getMessages();
    }, [currentChat]);



    // initial socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:4000')
        setSocket(newSocket)

        // we also need a cleanup function 
        return () => {
            newSocket.disconnect()
        }
    }, [user])



    // adding new user
    useEffect(() => {

        if (socket === null) return

        // send the userId to online users
        socket.emit('addNewUser', user?._id)

        // get the online users
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res)

        })

        // clean up function if the user disconnects
        return () => {
            socket.off('getOnlineUsers')
        }

    }, [socket])


    // send message
    useEffect(() => {

        if (socket === null) return

        const recipientId = currentChat?.members.find((id) => id !== user?._id)

        socket.emit("sendMessage", {
            ...newMessage, recipientId
        })

    }, [newMessage])

    // receive message and Notification
    useEffect(() => {

        if (socket === null) return

        socket.on('getMessage', (res) => {
            if (currentChat?._id !== res.chatId) return

            setMessages(prev => [...prev, res])
        })

        // get notification
        socket.on('getNotification', (res) => {

            // check if the current chat is open
            const isChatOpen = currentChat?.members.some(id => id === res.senderId)

            if (isChatOpen) setNotifications(prev => [{ ...res, isRead: true }, ...prev])
            else
                setNotifications(prev => [res, ...prev])
        })

        return () => {
            socket.off('getNotification')
        }

    }, [socket, currentChat])





    // ------------------------ Functions ------------------------

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log('Type something')

        const response = await postRequest(`${baseURL}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }))

        if (response.error) {
            return setSendTextMessageError(response)

        }

        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage("")


    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])


    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseURL}/chats`, JSON.stringify({
            firstId, secondId
        }))

        if (response.error) return console.log("Error in creating chat", response)

        setUserChats((prev) => [...prev, response])

    }, [])

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map(n => { return { ...n, isRead: true } })

        setNotifications(mNotifications)

    }, [])


    return <ChatContext.Provider value={{

        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        allUsers,

        createChat,
        updateCurrentChat,
        currentChat,

        messages,
        isMessageLoading,
        messageError,
        sendTextMessage,

        onlineUsers,
        notifications,
        markAllNotificationsAsRead

    }}>
        {children}
    </ChatContext.Provider>

}
