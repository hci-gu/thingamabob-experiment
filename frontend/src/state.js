import { atom } from 'jotai'

export const groupsAtom = atom([])
export const activeGroupAtom = atom(null)

const rand = () => Math.floor(Math.random() * 12) + 1
export const trialsAtom = atom(
  Array.from({ length: 5 }).map(() => ({
    id: '',
    active: false,
    values: [rand(), rand(), rand(), rand()],
    duration: 5121,
  }))
)
export const selectedTrialIndex = atom(null)

export const activeTrialAtom = atom({
  id: '',
  active: true,
  values: [6, 6, 6, 6],
})
