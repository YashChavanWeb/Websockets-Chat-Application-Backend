import { useState, useEffect } from "react";
import { baseURL, getRequest } from "../utils/services";

export const useFetchRecipientUser = ({ chat, user }) => {
    const [recipientUser, setRecipientUser] = useState(null)
    const [error, setError] = useState(null)

    const recipientId = chat?.members.find((id) => id !== user?._id)

    useEffect(() => {
        const getUser = async () => {

            if (!recipientId) return null

            const res = await getRequest(`${baseURL}/users/find/${recipientId}`)
            if (res.error) {
                return setError(error)
            }
            setRecipientUser(res)
        }

        getUser()

    }, [recipientId])

    return { recipientUser }
}

