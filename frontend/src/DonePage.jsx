import { Button, Textarea } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PageContainer } from './theme'

const url = import.meta.env.VITE_API_URL

const Container = styled(PageContainer)`
  > h1 {
    font-size: 2rem;
  }
`

const DonePage = () => {
  const history = useHistory()
  const { id, index } = useParams()
  const [text, setText] = useState('')

  const onSubmit = async () => {
    if (text.length < 5) {
      return alert('Please write a suggestion before submitting')
    }
    await fetch(`${url}/groups/${id}/${index}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: text,
      }),
    })
    history.push(`/group/${id}`)
  }

  return (
    <Container>
      <h1>Thank you for participating!</h1>
      <br></br>
      <br></br>
      <span>
        Please write a short (2-3 sentences) suggestion of your theory for the
        next participant in the order.
      </span>
      <br></br>
      <Textarea
        placeholder="write suggestion here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br></br>
      <Button width={200} onClick={onSubmit} disabled={!text.length}>
        Submit
      </Button>
    </Container>
  )
}

export default DonePage
