import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useGroup } from '../hooks/group'
import useSocket from '../hooks/useSocket'
import { activeTrialAtom, selectedTrialIndex, trialsAtom } from '../state'
import { PageContainer } from '../theme'
import Controls from './Controls'
import Trials from './Trials'
import styled from '@emotion/styled'

const ActiveTrial = () => {
  const socket = useSocket()
  const [trial, setTrialValues] = useAtom(activeTrialAtom)

  useEffect(() => {
    if (socket) {
      socket.on('time', (data) =>
        setTrialValues((state) => ({ ...state, duration: data.durationMs }))
      )
    }
  }, [socket])

  const onChange = (index, value) => {
    // socket.emit('change', { index, value })
    setTrialValues((state) => ({
      ...state,
      values: [
        ...state.values.slice(0, index),
        value,
        ...state.values.slice(index + 1),
      ],
    }))
  }

  return (
    <div>
      <Controls trial={trial} onChange={onChange} />
    </div>
  )
}

const TrialsContainer = styled.div`
  display: flex;

  justify-content: space-around;
`

const Experiment = () => {
  const group = useGroup()
  const [trials] = useAtom(trialsAtom)
  const [trialIndex] = useAtom(selectedTrialIndex)

  if (!group) {
    return <span>Loading...</span>
  }

  return (
    <PageContainer>
      <Trials />
      <br></br>
      <TrialsContainer>
        <Controls trial={trialIndex ? trials[trialIndex] : trials[0]} />
        <ActiveTrial />
      </TrialsContainer>
    </PageContainer>
  )
}

export default Experiment
