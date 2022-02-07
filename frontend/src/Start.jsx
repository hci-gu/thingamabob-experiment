import React, { useState } from 'react'
import { PageContainer } from './theme'
import { Button, Input, Select } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { useGroups } from './hooks/group'
import styled from '@emotion/styled'

const CreateGroup = styled.div`
  display: flex;
  flex-direction: column;
  > button {
    align-self: flex-end;
    margin-top: 1rem;
  }
`

const Start = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [groups, createGroup] = useGroups()

  const create = async () => {
    const group = await createGroup()
    history.push(`/group/${group.id}`)
  }

  const groupSelected = (groupId) => {
    history.push(`/group/${groupId}`)
  }
  return (
    <PageContainer>
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
        <Input
          placeholder="Namn på grupp"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button width={200} onClick={create}>
          Skapa
        </Button>
      </CreateGroup>
    </PageContainer>
  )
}

export default Start
