import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { activeGroupAtom, groupsAtom } from '../state'

const url = 'http://864a-129-16-31-25.ngrok.io'

export const useGroups = () => {
  const [groups, setGroups] = useAtom(groupsAtom)
  useEffect(() => {
    const run = async () => {
      const response = await fetch(`${url}/groups`)
      const data = await response.json()
      setGroups(data)
    }
    run()
  }, [])

  const createGroup = async (name) => {
    const response = await fetch(`${url}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    const data = await response.json()
    return data
  }

  return [groups, createGroup]
}

export const useGroup = () => {
  const { id } = useParams()
  const [group, setGroup] = useAtom(activeGroupAtom)
  useEffect(() => {
    const run = async () => {
      const response = await fetch(`${url}/groups/${id}`)
      const data = await response.json()
      setGroup(data)
    }
    if (id) run()
  }, [id])

  return group
}
