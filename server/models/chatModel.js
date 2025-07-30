const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    members: Array
}, {
    timestamps: true
})

const chatModel = mongoose.model('Chat', chatSchema)

module.exports = chatModel