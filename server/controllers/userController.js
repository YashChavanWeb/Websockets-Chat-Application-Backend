const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        let user = await userModel.findOne({ email })

        if (user) return res.status(400).json("User with the same email exists")
        if (!name || !email || !password) return res.status(400).json("All fields are required")
        if (!validator.isEmail(email)) return res.status(400).json("Email must be a valid email")
        if (!validator.isStrongPassword(password)) return res.status(400).json("The password is not strong")

        user = new userModel({ name, email, password })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name, email, token })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body

        let user = await userModel.findOne({ email })

        if (!user) return res.status(400).json("Invalid Credentials")
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return res.status(400).json("Invalid Credentials")

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name: user.name, email, token })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const fetchUser = async (req, res) => {

    // use here req.params not req.body
    const { userId } = req.params

    try {
        const user = await userModel.findById(userId)
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getUsers = async (req, res) => {

    try {
        const users = await userModel.find()
        res.status(200).json(users)


    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

}





module.exports = { registerUser, loginUser, fetchUser, getUsers }