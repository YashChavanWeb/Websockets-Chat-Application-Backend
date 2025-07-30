import React from 'react'
import { useFetchRecipientUser } from '../../hooks/useRecipient'
import { Stack } from 'react-bootstrap'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const UserChat = ({ chat, user }) => {

    const { recipientUser } = useFetchRecipientUser({ chat, user })
    const { onlineUsers } = useContext(ChatContext)

    // console.log("Check for online : ", onlineUsers)

    const isOnline = onlineUsers?.some(
        (user) => user?.userId === recipientUser?._id
    );


    return (
        <div>
            <Stack
                direction='horizontal'
                gap={3}
                className='user-card align-items-center justify-content-between'
            >

                <div className='d-flex'>
                    <div className='me-2'>A</div>
                    <div className='text-content'>
                        <div className='name'>{recipientUser?.name}</div>
                        {/* <div className='text'>Text Message</div> */}
                    </div>
                </div>

                <div className='d-flex flex-column align-items-end'>
                    {/* <div className="data">
                        08/02/2005
                    </div> */}
                    <div className="this-user-notifications">2</div>
                    <div className={
                        isOnline ? 'user-online' : ''
                    }></div>
                </div>

            </Stack >
        </div >
    )
}

export default UserChat
