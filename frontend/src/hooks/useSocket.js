import { useEffect, useState } from 'react'

const url = 'http://864a-129-16-31-25.ngrok.io/'

const useSocket = () => {
  const [s, setSocket] = useState(null)

  useEffect(() => {
    console.log('connect socket!')
    const socket = io(url, {
      transports: ['websocket'],
    })
    socket.on('connection', () => {
      console.log('connection')
    })
    socket.on('connect', () => console.log('connect'))
    socket.on('data', (data) => console.log(data))

    setSocket(socket)
    return () => {}
  }, [])

  return s
}

export default useSocket
