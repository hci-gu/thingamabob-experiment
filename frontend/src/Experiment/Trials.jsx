import React from 'react'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import { selectedTrialAtom } from '../state'
import { canSeeTrialForIndex, colorForIndex, isActiveGroup } from '../utils'
import { useActiveGroupType } from '../hooks/group'

const createGroup = (offset) =>
  Array(5)
    .fill()
    .map((_, index) => offset * 5 + index)

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 8px;

  height: 50px;
`

const TrialButtonContainer = styled.div`
  border: 2px solid ${(props) => props.color};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 24px;

  ${(props) => props.completed && `background-color: ${props.bgColor}`}

  ${({ active, color }) =>
    active && `font-weight: bold; background-color: ${color}; font-size: 28px`};

  ${(props) =>
    props.canClick &&
    `
    cursor: pointer;
    font-weight: bold;
  `}
`

const TrialButton = ({ trial, trials, index, activeIndex }) => {
  const [selectedTrial, setTrial] = useAtom(selectedTrialAtom)
  const type = useActiveGroupType()
  const color = colorForIndex(index + 1)
  const current = index == activeIndex

  if (!trial) {
    return (
      <TrialButtonContainer active={false} color={color} current={current}>
        {index + 1}
      </TrialButtonContainer>
    )
  }

  return (
    <TrialButtonContainer
      color={color}
      bgColor={colorForIndex(index + 1, 0.5)}
      canClick={canSeeTrialForIndex(index, activeIndex, type, trials)}
      onClick={() => {
        if (canSeeTrialForIndex(index, activeIndex, type, trials)) {
          setTrial(trial)
        }
      }}
      active={selectedTrial.index === trial.index}
      completed
    >
      {trial.result === null ? 'Active' : index != null ? index + 1 : 'H'}
    </TrialButtonContainer>
  )
}

const TrialGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border: 2px solid ${(props) => props.color};

  position: relative;
  > span {
    width: 150px;
    text-align: center;
    left: calc(50% - 75px);
    top: -30px;
    position: absolute;
  }
`

const Trials = ({ trials }) => {
  const activeTrialIndex = trials.length

  return (
    <Container>
      {Array(5)
        .fill()
        .map((_, groupIndex) => createGroup(groupIndex))
        .map((group, i) => (
          <TrialGroup color={colorForIndex((i + 1) * 5)}>
            <span>
              {isActiveGroup(i, activeTrialIndex)
                ? 'You'
                : `Participant ${i + 1}`}
            </span>
            {group.map((index) => (
              <TrialButton
                activeIndex={activeTrialIndex}
                key={`Trial_${index}`}
                trial={trials[index]}
                index={index}
                trials={trials}
              />
            ))}
          </TrialGroup>
        ))}
    </Container>
  )
}

export default Trials
