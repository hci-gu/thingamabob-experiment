import { useEffect, useState } from 'react'

const url = import.meta.env.VITE_API_URL

const useSocket = () => {
  const [s, setSocket] = useState(null)

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket'],
    })
    socket.on('data', (data) => console.log(data))

    setSocket(socket)
    return () => {}
  }, [])

  return s
}

export default useSocket
