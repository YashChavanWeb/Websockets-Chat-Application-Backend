const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    chatId: String,  // get all messages for a chat
    senderId: String,  // who sent the message
    text: String  // the actual message
}, {
    timestamps: true
})

const messageModel = mongoose.model('Message', messageSchema)

module.exports = messageModel