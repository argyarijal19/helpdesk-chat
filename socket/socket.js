const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const userRemove = (socketId) => {
    users = users.filter(u => u.socketId !== socketId );
} 


const findFriend = (id) => {
    return users.find(u => u.userId === id);
}


let users = [];
const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some(u=> u.userId === userId);

    if(!checkUser){
        users.push({userId, socketId, userInfo});
    }
}


io.on('connection', (socket) => {
    console.log('socket is connecting....')
    socket.on('addUser', (userId, userInfo) => {
        addUser(userId, socket.id, userInfo);
        io.emit('getUser', users);
    });

    socket.on('sendMessage', (data) =>{
        const user = findFriend(data.recieverId);

        if(user !== undefined){
            socket.to(user.socketId).emit('getMessage', {
                senderId: data.senderId,
                senderName: data.senderName,
                recieverId: data.recieverId,
                createAt: data.time,
                message: {
                    text: data.message.text,
                    image: data.message.image
                } 
            })
        }
    })

    socket.on('typingMessage', (data) => {
        const user = findFriend(data.recieverId);
        if(user !== undefined){
            socket.to(user.socketId).emit('typingMessageGet', {
                senderId: data.senderId,
                recieverId: data.recieverId,
                msg: data.msg
            })
        }
        console.log(user)
    })


    socket.on('disconnect', () => {
        console.log('user is disconnet....');
        userRemove(socket.id);
        io.emit('getUser', users);
    })
})