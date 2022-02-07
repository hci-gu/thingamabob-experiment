import React from 'react'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { selectedTrialIndex, trialsAtom } from '../state'

const Container = styled.div`
  //   border: 1px dotted black;
  display: flex;
`

const TrialButtonContainer = styled.div`
  margin: 0.5rem;
  width: 100px;
  height: 100px;
  background-color: red;
`

const TrialButton = ({ index }) => {
  const [, setIndex] = useAtom(selectedTrialIndex)
  return (
    <TrialButtonContainer
      onClick={() => setIndex(index)}
    ></TrialButtonContainer>
  )
}

const Trials = () => {
  // visa de två sista
  const [trials] = useAtom(trialsAtom)
  return (
    <Container>
      {trials.map((trial, index) => (
        <TrialButton key={`Trial_${index}`} index={index} />
      ))}
    </Container>
  )
}

export default Trials
