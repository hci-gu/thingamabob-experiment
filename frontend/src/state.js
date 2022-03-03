import { atom } from 'jotai'

export const groupsAtom = atom([])
export const activeGroupAtom = atom(null)
export const selectedTrialAtom = atom(null)

export const INITIAL_TRIAL_STATE = {
  id: '',
  active: true,
  config: [6, 6, 6, 6],
  result: null,
}
export const activeTrialAtom = atom(INITIAL_TRIAL_STATE)
