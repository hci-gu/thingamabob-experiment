export const TRIAL_TYPE = {
  LAST_TWO: 'last-2',
  BEST_TWO: 'best-2',
}

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

export const canSeeTrialForIndex = (
  trialIndex,
  activeIndex,
  type,
  trials,
  isDone
) => {
  activeIndex = isDone ? activeIndex - 1 : activeIndex
  const trialGroup = Math.floor(trialIndex / 5)
  const myGroup = Math.floor(activeIndex / 5)
  // it's my trials so I can see them
  if (trialGroup === myGroup) {
    if (isDone && type === TRIAL_TYPE.BEST_TWO) {
      const lastGroupTrials = trials.slice(trialGroup, trialGroup + 5)
      return lastGroupTrials
        .sort((a, b) => a.result - b.result)
        .slice(0, 2)
        .some((trial) => trial.index === trialIndex)
    }

    const offset = activeIndex - trialIndex
    return offset <= 2
  }

  if (trialGroup === myGroup - 1) {
    if (type === TRIAL_TYPE.LAST_TWO) {
      // It's the previous group so I can see that last 2 trials for that group
      const offset = myGroup * 5 - trialIndex
      return offset <= 2
    }
    if (type === TRIAL_TYPE.BEST_TWO) {
      const lastGroupTrials = trials.slice(trialGroup * 5, trialGroup * 5 + 5)
      return lastGroupTrials
        .sort((a, b) => a.result - b.result)
        .slice(0, 2)
        .some((trial) => trial.index === trialIndex)
    }
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
  if (group[group.length - 1]) {
    return group[group.length - 1].comment
  }
  return null
}
