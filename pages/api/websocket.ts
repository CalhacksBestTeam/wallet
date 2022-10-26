import { Server } from 'Socket.IO'

const SocketHandler = (req : any, res : any) => {
    console.log("YO")

    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)

        io.sockets.on('connection', (socket : any) => {
            socket.on('message', (data : any) => {
                console.log(data)
                socket.emit("message", data)
            })
        })
        res.socket.server.io = io
    }
    res.end()

}

export default SocketHandler
