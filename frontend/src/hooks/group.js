import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { activeGroupAtom, groupsAtom, selectedTrialAtom } from '../state'
import { getPreviousGroupComment } from '../utils'

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

      const trials = data.trials.map((trial, i) => ({
        ...trial,
        index: i,
      }))
      if (trials.length === 0) {
        setSelectedTrial(null)
        setGroup({
          ...data,
          trials: [],
          history: [],
        })
        return
      }
      const current = trials[trials.length - 1]

      setSelectedTrial(current)
      setGroup({
        ...data,
        trials,
        comment: getPreviousGroupComment(trials, trials.length),
      })
    }
    if (id) run()
  }, [id, refresh])

  return [group, () => setRefresh(new Date())]
}
