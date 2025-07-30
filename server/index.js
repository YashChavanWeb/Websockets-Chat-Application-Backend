const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('../server/routes/userRoute')
const chatRoutes = require('../server/routes/chatRoute')
const messageRoutes = require('../server/routes/messageRoute')

const app = express()
require('dotenv').config()


const PORT = process.env.PORT || 3000
const URI = process.env.ATLAS_URI

// middleware functions 
app.use(express.json())
app.use(cors())
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)


app.get('/', (req, res) => {
    res.send("Hello")

})

// create a server
app.listen(PORT, (req, res) => {
    console.log(`Server running on PORT: ${PORT}`)
})

// connect to dataabse
mongoose.connect(URI)
    .then(() => {
        console.log("MongoDB is connected")
    })
    .catch((err) => {
        console.log(`MongoDB Connection error: ${err.message}`)
    })



