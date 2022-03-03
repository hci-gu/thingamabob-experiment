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
import { colorForIndex } from '../utils'

const Wrapper = styled.div``

const Background = styled.div`
  background-color: ${(props) => props.color};
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #000;
`

const Container = styled.div`
  background-color: #fff;
  border: 2px solid black;
  padding: 24px;
  border-radius: 24px;
  position: relative;

  width: 360px;
  height: 360px;

  > span {
    position: absolute;
    left: 12px;
    bottom: 12px;
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

const Controls = ({ trial, onChange, children, active = false }) => {
  const isReadOnly = !trial.active || trial.validated
  const text = active ? 'Desired configuration' : 'Previous configuration'

  return (
    <Wrapper>
      <span>{text}</span>
      <Background color={colorForIndex(trial.index + 1)}>
        <Container isActive={trial.active}>
          <ControlSlider
            index={0}
            value={trial.config[0]}
            orientation="vertical"
            minH={32}
            style={{ left: '48%', top: '5%' }}
            onChange={onChange}
            isReadOnly={isReadOnly}
          />
          <ControlSlider
            index={1}
            value={trial.config[1]}
            width={124}
            style={{ right: '5%', top: '48%' }}
            onChange={onChange}
            isReadOnly={isReadOnly}
          />
          <ControlSlider
            index={2}
            value={trial.config[2]}
            orientation="vertical"
            minH={32}
            style={{ left: '48%', top: '60%' }}
            onChange={onChange}
            isReadOnly={isReadOnly}
            reverse
          />
          <ControlSlider
            index={3}
            value={trial.config[3]}
            width={124}
            style={{ left: '5%', top: '48%' }}
            onChange={onChange}
            isReadOnly={isReadOnly}
            reverse
          />
          <span>
            Duration:{' '}
            {trial.result
              ? Intl.NumberFormat('sv-se').format(trial.result)
              : '- '}{' '}
            ms
          </span>
          {children}
        </Container>
      </Background>
    </Wrapper>
  )
}

export default Controls
