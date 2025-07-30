// creating a socket server
const { Server } = require('socket.io')

const io = new Server({
    cors: "http://localhost:5173"
})

let onlineUsers = []

io.on('connection', (socket) => {

    socket.emit(socket.id)

    // event to be triggered from the frontend
    socket.on("addNewUser", (userId) => {

        !onlineUsers.some(user => user.userId === userId)   // returns true if any element meets the condition
            &&
            onlineUsers.push(
                {
                    userId,
                    socketId: socket.id
                }
            )
        io.emit("getOnlineUsers", onlineUsers)
    })


    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId)

        if (user) {
            io.to(user.socketId).emit("getMessage", message)

            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }

    })

    // disconnect the user if the user is not in the connection
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        io.emit("getOnlineUsers", onlineUsers)
    })


})

io.listen(4000)