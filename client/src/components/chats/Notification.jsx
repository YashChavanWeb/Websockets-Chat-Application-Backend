import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { unreadNotificationsFunc } from '../../utils/unreadNotifications'
import moment from 'moment'

const Notification = () => {

    const { user } = useContext(AuthContext)
    const { notifications, userChats, allUsers, markAllNotificationsAsRead } = useContext(ChatContext)


    const [isOpen, setIsOpen] = useState(false)

    const unreadNotifications = unreadNotificationsFunc(notifications)
    const modifiedNotifications = notifications.map((n) => {

        const sender = allUsers.find(user => user._id === n.senderId)
        return ({
            ...n,
            senderName: sender?.name
        })

    })



    return (
        <div className='notifications'>
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>

                {
                    unreadNotifications?.length === 0 ? null
                        : (
                            <span className='notification-count'>
                                <span>{unreadNotifications.length}</span>
                            </span>
                        )
                }

            </div>
            {
                isOpen ?
                    <div className="notifications-box">
                        <div className="notifications-header">
                            <h3>Notifications: </h3>
                            <div className='mark-as-red' onClick={() => markAllNotificationsAsRead(notifications)}>
                                Mark All as read
                            </div>
                        </div>
                        {modifiedNotifications?.length === 0
                            ? <span>No Notifications !</span>
                            : null
                        }

                        {modifiedNotifications && modifiedNotifications.map((n, idx) => {
                            return (
                                <div key={idx} className={n.isRead ? 'notification' : 'notification not-read'}>
                                    <span> {`${n.senderName} sent you a Message`} </span>
                                    <span className='notification-time'> {moment(n.date).calendar()} </span>
                                </div>
                            )
                        })}

                    </div>
                    :
                    null
            }


        </div>
    )
}

export default Notification
