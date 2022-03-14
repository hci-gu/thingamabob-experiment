import { useParams } from 'react-router-dom'
import { useGroup } from './group'

export const useDoneTrial = () => {
  const [group] = useGroup()
  const { index } = useParams()

  if (!group || !group.trials) return null

  return group.trials[index - 1]
}
