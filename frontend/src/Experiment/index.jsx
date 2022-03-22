import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useGroup, useIsDoneWithTrials } from '../hooks/group'
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
import { Button, CircularProgress, Textarea } from '@chakra-ui/react'
import { useHistory, useParams } from 'react-router-dom'

const url = import.meta.env.VITE_API_URL
const FAIL_DURATION = 9999999

const SubmitButton = styled(Button)`
  position: absolute;
  bottom: 12px;
  right: 12px;
`

const ActiveTrial = ({ refreshGroup, index }) => {
  const history = useHistory()
  const { id } = useParams()
  const socket = useSocket()
  const [trial, setTrialValues] = useAtom(activeTrialAtom)

  const submitTime = async (duration) => {
    await fetch(`${url}/groups/${id}/trials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: trial.config,
        result: duration,
      }),
    })
    setTrialValues(INITIAL_TRIAL_STATE)
    if ((index + 1) % 5 === 0) {
      history.push(`/group/${id}/done/${index + 1}`)
      location.reload()
      return
    }
    refreshGroup()
  }

  useEffect(() => {
    if (socket && trial.validated) {
      socket.on('time', async (data) => {
        submitTime(data.durationMs)
      })
    }
    return () => socket && socket.off('time')
  }, [socket, trial.validated])

  const onChange = (i, value) => {
    setTrialValues((state) => ({
      ...state,
      config: [
        ...state.config.slice(0, i),
        value,
        ...state.config.slice(i + 1),
      ],
    }))
  }

  const onValidatePressed = async () => {
    if (socket) socket.emit('validated')
    setTrialValues((state) => ({
      ...state,
      validated: true,
    }))
  }

  const onCancelPressed = async () => {
    if (confirm('Vill du avbryta?')) {
      submitTime(FAIL_DURATION)
    }
  }

  return (
    <div>
      <Controls trial={{ ...trial, index }} onChange={onChange} active>
        <SubmitButton onClick={onValidatePressed} disabled={trial.validated}>
          {trial.validated ? 'Validerad' : 'Validera'}
        </SubmitButton>
      </Controls>
    </div>
  )
}

const TrialsContainer = styled.div`
  display: grid;

  padding: 0 10%;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  justify-content: center;
  justify-items: center;
`

const TheoryContainer = styled.div`
  width: 100%;
  grid-column: 1 / span 2;

  > span {
    font-weight: bold;
  }
`

const TheoryInput = styled(Textarea)`
  grid-column: 1 / span 2;

  color: #000;
  opacity: 1 !important;
`

const UndoButton = styled.button`
  position: absolute;
  bottom: -4rem;
  left: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
`

const Experiment = () => {
  const [group, refreshGroup] = useGroup()
  const history = useHistory()
  const [trial, setTrialValues] = useAtom(activeTrialAtom)
  const [selectedTrial] = useAtom(selectedTrialAtom)
  const isDoneWithTrial = useIsDoneWithTrials()

  if (!group) {
    return (
      <PageContainer>
        <CircularProgress isIndeterminate style={{ alignSelf: 'center' }} />
      </PageContainer>
    )
  }

  const undo = async () => {
    if (confirm('Är du säker?')) {
      const index = group.trials.length - 1
      await fetch(`${url}/groups/${group.id}/trials/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      refreshGroup()
      if (isDoneWithTrial) {
        history.push(`/group/${group.id}`)
      }
    }
  }

  const abort = async () => {
    if (confirm('Är du säker?')) {
      const index = group.trials.length
      await fetch(`${url}/groups/${group.id}/trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: trial.config,
          result: FAIL_DURATION,
        }),
      })
      setTrialValues(INITIAL_TRIAL_STATE)
      if ((index + 1) % 5 === 0) {
        history.push(`/group/${group.id}/done/${index + 1}`)
        return
      }
      refreshGroup()
    }
  }

  return (
    <PageContainer>
      <Trials trials={group.trials} />
      <br></br>
      <TrialsContainer>
        {group.comment && (
          <TheoryContainer>
            <span>Föregående deltagares förslag:</span>
            <TheoryInput
              value={`Hjulet rullar snabbare nerför banan när ${group.comment}`}
              disabled
            />
          </TheoryContainer>
        )}
        {selectedTrial && <Controls trial={selectedTrial} />}
        {!isDoneWithTrial && (
          <ActiveTrial
            refreshGroup={refreshGroup}
            index={group.trials.length}
          />
        )}
      </TrialsContainer>
      <UndoButton onClick={undo}>0</UndoButton>
      <UndoButton onClick={abort} style={{ left: 60 }}>
        1
      </UndoButton>
    </PageContainer>
  )
}

export default Experiment
