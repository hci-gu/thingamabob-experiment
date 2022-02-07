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

  width: 500px;
  height: 500px;

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

const Controls = ({ trial, onChange }) => {
  return (
    <Container isActive={trial.active}>
      <ControlSlider
        index={0}
        value={trial.values[0]}
        orientation="vertical"
        minH={44}
        style={{ left: '50%', top: '0' }}
        onChange={onChange}
        isReadOnly={!trial.active}
      />
      <ControlSlider
        index={1}
        value={trial.values[1]}
        width={200}
        style={{ right: '0', top: '50%' }}
        onChange={onChange}
        isReadOnly={!trial.active}
      />
      <ControlSlider
        index={2}
        value={trial.values[2]}
        orientation="vertical"
        minH={44}
        style={{ left: '50%', top: '70%' }}
        onChange={onChange}
        isReadOnly={!trial.active}
        reverse
      />
      <ControlSlider
        index={3}
        value={trial.values[3]}
        width={200}
        style={{ left: '0', top: '50%' }}
        onChange={onChange}
        isReadOnly={!trial.active}
        reverse
      />
      <span>
        Duration:{' '}
        {trial.duration
          ? Intl.NumberFormat('sv-se').format(trial.duration)
          : '- '}{' '}
        ms
      </span>
    </Container>
  )
}

export default Controls
