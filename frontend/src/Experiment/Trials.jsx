import React from 'react'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { selectedTrialAtom } from '../state'
import { Center, Divider } from '@chakra-ui/react'

const Container = styled.div`
  //   border: 1px dotted black;
  display: flex;

  height: 100px;
`

const TrialButtonContainer = styled.div`
  margin: 0.5rem;
  width: 75px;
  height: 75px;
  border: 1px solid black;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 24px;
  cursor: pointer;

  ${({ active }) => active && `border: 4px solid black; font-weight: bold;`}
`

const TrialButton = ({ trial, index }) => {
  const [selectedTrial, setTrial] = useAtom(selectedTrialAtom)
  return (
    <TrialButtonContainer
      onClick={() => setTrial(trial)}
      active={selectedTrial.result === trial.result}
    >
      {trial.result === null ? 'Active' : index != null ? index + 1 : 'H'}
    </TrialButtonContainer>
  )
}

const Trials = ({ trials, history }) => {
  return (
    <Container>
      {history.map((trial, index) => (
        <TrialButton key={`Trial_h_${index}`} trial={trial} />
      ))}
      <Center width={25}>
        <Divider orientation="vertical" color={'#000'} />
      </Center>
      {trials.map((trial, index) => (
        <TrialButton key={`Trial_${index}`} trial={trial} index={index} />
      ))}
    </Container>
  )
}

export default Trials
