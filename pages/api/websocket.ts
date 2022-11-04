import { Server } from 'Socket.IO'

const SocketHandler = (req : any, res : any) => {
    console.log("YO")

    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                allowedHeaders: ["Access-Control-Allow-Origin: *"],
            }
        })

        io.sockets.on('connection', (socket : any) => {
            socket.join("test")

            socket.on('message', (data : any) => {
                console.log(data)
                io.emit("message", data)
            })

            socket.on('ping', () => {
                console.log("RECIEVED PING")
                // socket.in("test").emit('pong')
                io.emit('pong')
            })
        })
        res.socket.server.io = io
    }
    res.end()


}

export default SocketHandler
