import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useGroup } from '../hooks/group'
import useSocket from '../hooks/useSocket'
import {
  activeTrialAtom,
  INITIAL_TRIAL_STATE,
  selectedTrialAtom,
} from '../state'
import { PageContainer } from '../theme'
import Controls from './Controls'
import Trials from './Trials'
import styled from '@emotion/styled'
import { Button, CircularProgress } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

const url = import.meta.env.VITE_API_URL

const SubmitButton = styled(Button)`
  position: absolute;
  bottom: 0;
  right: 0;
`

const ActiveTrial = ({ refreshGroup }) => {
  const { id } = useParams()
  const socket = useSocket()
  const [trial, setTrialValues] = useAtom(activeTrialAtom)

  useEffect(() => {
    if (socket && trial.validated) {
      socket.on('time', async (data) => {
        await fetch(`${url}/groups/${id}/trials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: trial.config,
            result: data.durationMs,
          }),
        })
        // setTrialValues(INITIAL_TRIAL_STATE)
        refreshGroup()
      })
    }
    return () => socket && socket.off('time')
  }, [socket, trial.validated])

  const onChange = (index, value) => {
    setTrialValues((state) => ({
      ...state,
      config: [
        ...state.config.slice(0, index),
        value,
        ...state.config.slice(index + 1),
      ],
    }))
  }

  const onValidatePressed = async () => {
    setTrialValues((state) => ({
      ...state,
      validated: true,
    }))
  }

  return (
    <div>
      <Controls trial={trial} onChange={onChange}>
        <SubmitButton onClick={onValidatePressed} disabled={trial.validated}>
          {trial.validated ? 'Validated' : 'Validate'}
        </SubmitButton>
      </Controls>
    </div>
  )
}

const TrialsContainer = styled.div`
  display: flex;

  justify-content: space-around;
`

const Experiment = () => {
  const [group, refreshGroup] = useGroup()
  const [selectedTrial] = useAtom(selectedTrialAtom)

  if (!group) {
    return (
      <PageContainer>
        <CircularProgress isIndeterminate style={{ alignSelf: 'center' }} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Trials trials={group.trials} history={group.history} />
      <br></br>
      <TrialsContainer>
        {selectedTrial && <Controls trial={selectedTrial} />}
        <ActiveTrial refreshGroup={refreshGroup} />
      </TrialsContainer>
    </PageContainer>
  )
}

export default Experiment
