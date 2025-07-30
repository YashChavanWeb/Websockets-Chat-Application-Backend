import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessageLoading, sendTextMessage } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser({ chat: currentChat, user });

    // for input message
    const [textMessage, setTextMessage] = useState("");

    // for dynamic scroll
    const scroll = useRef()

    // use effect to handle the scroll
    useEffect(() => {
        scroll.current?.scrollIntoView({
            behavior: 'smooth'
        })
    }, [messages])

    if (!recipientUser)
        return (
            <p style={{ textAlign: "center", width: "100%" }}>No Chat Selected</p>
        );

    if (isMessageLoading)
        return (
            <p style={{ textAlign: "center", width: "100%" }}>Loading the Chats</p>
        );

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>

            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, idx) => {
                        return (
                            <Stack
                                key={idx}
                                className={
                                    `${message?.senderId === user?._id
                                        ? 'message self align-self-end flex-grow-0'
                                        : 'message align-self-start flex-grow-0'
                                    }`
                                }
                                ref={scroll}
                            >
                                <div>
                                    <span>{message.text}</span>
                                </div>
                                <span>
                                    {moment(message.createdAt).calendar()}
                                </span>
                            </Stack>
                        );
                    })}
            </Stack>

            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji value={textMessage} onChange={setTextMessage} />
                <button
                    className="send-btn"
                    onClick={() =>
                        sendTextMessage(textMessage, user, currentChat._id, sendTextMessage)
                    }
                >
                    Go
                </button>
            </Stack>
        </Stack>

    );
};

export default ChatBox;
