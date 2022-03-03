import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { activeGroupAtom, groupsAtom, selectedTrialAtom } from '../state'

const url = import.meta.env.VITE_API_URL

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
  const [refresh, setRefresh] = useState(new Date())
  const { id } = useParams()
  const [group, setGroup] = useAtom(activeGroupAtom)
  const [, setSelectedTrial] = useAtom(selectedTrialAtom)
  useEffect(() => {
    const run = async () => {
      setGroup(null)
      const response = await fetch(`${url}/groups/${id}`)
      const data = await response.json()

      // split trials to five
      const groups = data.trials.reduce((acc, cur, i) => {
        if (i % 5 === 0) {
          acc.push([])
        }
        acc[acc.length - 1].push(cur)
        return acc
      }, [])
      if (groups.length === 0) {
        setSelectedTrial(null)
        setGroup({
          ...data,
          trials: [],
          history: [],
        })
        return
      }
      const current = groups[groups.length - 1]

      setSelectedTrial(current[current.length - 1])
      setGroup({
        ...data,
        trials: current,
        history: groups.length > 1 ? groups[groups.length - 2].slice(3, 5) : [],
      })
    }
    if (id) run()
  }, [id, refresh])

  return [group, () => setRefresh(new Date())]
}
