import React from 'react'
import styled from '@emotion/styled'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from '@chakra-ui/react'

const Container = styled.div`
  position: relative;

  width: 450px;
  height: 450px;

  > span {
    position: absolute;
    left: 0;
    bottom: 0;
  }
`

const ControlSlider = ({ reverse, value, index, onChange, ...props }) => {
  const max = 12

  return (
    <div style={{ ...props.style, position: 'absolute' }}>
      <Slider
        min={1}
        max={max}
        {...props}
        value={value}
        isReversed={reverse}
        onChange={(v) => onChange(index, v)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          color="white"
          placement="top"
          backgroundColor={props.isReadOnly ? 'gray.300' : 'blue.500'}
          label={`${value}`}
          isOpen
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </div>
  )
}

const Controls = ({ trial, onChange, children }) => {
  const isReadOnly = !trial.active || trial.validated

  return (
    <Container isActive={trial.active}>
      <ControlSlider
        index={0}
        value={trial.config[0]}
        orientation="vertical"
        minH={44}
        style={{ left: '50%', top: '0' }}
        onChange={onChange}
        isReadOnly={isReadOnly}
      />
      <ControlSlider
        index={1}
        value={trial.config[1]}
        width={200}
        style={{ right: '0', top: '50%' }}
        onChange={onChange}
        isReadOnly={isReadOnly}
      />
      <ControlSlider
        index={2}
        value={trial.config[2]}
        orientation="vertical"
        minH={44}
        style={{ left: '50%', top: '70%' }}
        onChange={onChange}
        isReadOnly={isReadOnly}
        reverse
      />
      <ControlSlider
        index={3}
        value={trial.config[3]}
        width={200}
        style={{ left: '0', top: '50%' }}
        onChange={onChange}
        isReadOnly={isReadOnly}
        reverse
      />
      <span>
        Duration:{' '}
        {trial.result ? Intl.NumberFormat('sv-se').format(trial.result) : '- '}{' '}
        ms
      </span>
      {children}
    </Container>
  )
}

export default Controls
