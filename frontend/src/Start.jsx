import React, { useState } from 'react'
import { PageContainer } from './theme'
import { Button, Input, Select } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { useGroups } from './hooks/group'
import styled from '@emotion/styled'
import { TRIAL_TYPE } from './utils'

const CreateGroup = styled.div`
  display: flex;
  flex-direction: column;
  > button {
    align-self: flex-end;
    margin-top: 1rem;
  }

  > div {
    display: flex;

    > input {
      margin-right: 1rem;
    }
  }
`

const Start = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [type, setType] = useState(TRIAL_TYPE.LAST_TWO)
  const [groups, createGroup] = useGroups()

  const create = async () => {
    const group = await createGroup(name, type)
    history.push(`/group/${group.id}`)
  }

  const groupSelected = (groupId) => {
    history.push(`/group/${groupId}`)
  }
  return (
    <PageContainer style={{ width: '60%' }}>
      <h1>Hej! Vill du starta ett nytt experiment?</h1>
      <br></br>
      <Select
        placeholder="Välj grupp"
        onChange={(e) => groupSelected(e.target.value)}
      >
        {groups.map((group) => (
          <option value={group.id} key={`Group_${group.id}`}>
            {group.name}
          </option>
        ))}
      </Select>
      <br></br>
      <CreateGroup>
        <div>
          <Input
            placeholder="Namn på grupp"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            placeholder="Välj Experimenttyp"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value={TRIAL_TYPE.LAST_TWO}>Visa sista 2 försöken</option>
            <option value={TRIAL_TYPE.BEST_TWO}>Visa bästa 2 försöken</option>
          </Select>
        </div>
        <Button width={200} onClick={create}>
          Skapa
        </Button>
      </CreateGroup>
    </PageContainer>
  )
}

export default Start
