import { createContext, useCallback, useEffect } from "react";
import { useState } from "react";
import { baseURL, postRequest } from "../utils/services";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    // register states
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    })

    // login states
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    })

    // use effect to get the user everytime to display
    useEffect(() => {
        const user = localStorage.getItem('User')
        setUser(JSON.parse(user))
    }, [])

    // add all the register info
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])

    const registerUser = useCallback(async (e) => {
        e.preventDefault()
        setIsRegisterLoading(true)
        setRegisterError(null)

        const res = await postRequest(`${baseURL}/users/register`, JSON.stringify(registerInfo))
        setIsRegisterLoading(false)
        if (res.error) {
            return setRegisterError(res)
        }

        localStorage.setItem("User", JSON.stringify(res))
        setUser(res)
    }, [registerInfo])


    const loginUser = useCallback(async (e) => {
        e.preventDefault()

        setIsLoginLoading(true)
        setLoginError(null)

        const res = await postRequest(`${baseURL}/users/login`, JSON.stringify(loginInfo))
        setIsLoginLoading(false)

        if (res.error) {
            return setLoginError(res)
        }

        localStorage.setItem("User", JSON.stringify(res))
        setUser(res)


    }, [loginInfo])


    const logoutUser = useCallback(() => {
        localStorage.removeItem('User')
        setUser(null)
    }, [])


    return <AuthContext.Provider value={{
        user,

        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,

        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,

        logoutUser
    }}>
        {children}
    </AuthContext.Provider>
}