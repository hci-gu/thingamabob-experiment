export const colorForIndex = (index, opacity = 1) => {
  if (index <= 5) {
    return `rgba(167, 76, 72, ${opacity})`
  } else if (index <= 10) {
    return `rgba(54, 99, 99, ${opacity})`
  } else if (index <= 15) {
    return `rgba(240, 141, 61, ${opacity})`
  } else if (index <= 20) {
    return `rgba(69, 132, 57, ${opacity})`
  } else if (index <= 25) {
    return `rgba(96, 55, 99, ${opacity})`
  }
  return '#000'
}

export const canSeeTrialForIndex = (trialIndex, activeIndex) => {
  const trialGroup = Math.floor(trialIndex / 5)
  const myGroup = Math.floor(activeIndex / 5)
  // it's my trials so I can see them
  if (trialGroup === myGroup) {
    const offset = activeIndex - trialIndex
    return offset <= 2
  }
  // It's the previous group so I can see that last 2 trials for that group
  if (trialGroup === myGroup - 1) {
    const offset = myGroup * 5 - trialIndex
    return offset <= 2
  }
  return false
}

export const isActiveGroup = (groupIndex, activeIndex) => {
  const myGroup = Math.floor(activeIndex / 5)
  return groupIndex === myGroup
}

export const getPreviousGroupComment = (trials, activeIndex) => {
  const myGroup = Math.floor(activeIndex / 5)
  const group = trials.filter(({ index }) => {
    const groupIndex = Math.floor(index / 5)
    return groupIndex === myGroup - 1
  })
  return group[group.length - 1].comment
}
