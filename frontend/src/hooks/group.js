import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { activeGroupAtom, groupsAtom, selectedTrialAtom } from '../state'
import {
  canSeeTrialForIndex,
  getPreviousGroupComment,
  TRIAL_TYPE,
} from '../utils'

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

  const createGroup = async (name, type) => {
    const response = await fetch(`${url}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, type }),
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
  const [selectedTrial, setSelectedTrial] = useAtom(selectedTrialAtom)
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
      if (trials.length % 5 == 0 && data.type === TRIAL_TYPE.BEST_TWO) {
        let bestTrials = []
        let index = trials.length - 1
        while (index >= 0) {
          if (canSeeTrialForIndex(index, trials.length, data.type, trials)) {
            bestTrials.push(trials[index])
          }
          index--
        }
        setSelectedTrial(bestTrials.sort((a, b) => a.result - b.result)[0])
      } else {
        setSelectedTrial(trials[trials.length - 1])
      }

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

export const useActiveGroupType = () => {
  const [group] = useAtom(activeGroupAtom)
  return group.type
}
