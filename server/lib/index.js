const express = require('express')
const app = express()
// const serial = require('./serial')
const { Server } = require("socket.io")
const routes = require('./routes')

const port = process.env.PORT || 3000

app.use(routes)

const server = app.listen(port, () => {
  console.log(`listening on ${port}`)
})

const io = new Server(server)

io.on('connection', socket => {
  console.log('connected')
  socket.on('disconnect', () => console.log('disconnected'))
})

// serial.init({
//   devpath: process.env.DEVPATH || '/dev/tty.usbserial-D308DE73',
//   events: {
//     time: args => {
//       console.log('Got duration', args[0])

//       io.emit('time', { durationMs: +args[0] })
//     }
//   }
// })
