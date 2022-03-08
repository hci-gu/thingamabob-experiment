import { Button, Textarea } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PageContainer } from './theme'

const url = import.meta.env.VITE_API_URL

const Container = styled(PageContainer)`
  margin: 100px auto;
  width: 60%;

  > h1 {
    font-size: 2rem;
  }
`

const TextareaContainer = styled.div`
  position: relative;

  > span {
    position: absolute;
    z-index: 1;
    right: 0.5rem;
    top: 0.5rem;
    font-size: 13px;
    font-weight: 200;
  }
`

const WriteTheory = () => {
  const history = useHistory()
  const { id, index } = useParams()
  const [text, setText] = useState('')

  const onSubmit = async () => {
    if (text.length < 5) {
      return alert('Please write a suggestion before submitting')
    }
    if (text.length > 340) {
      return alert('Max 340 characters are allowed')
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
    <>
      <span>
        Please write a short (2-3 sentences) suggestion of your theory for the
        next participant in the order.
      </span>
      <br></br>
      <span style={{ fontWeight: 'bold' }}>
        The wheel covers the distance faster when…
      </span>
      <TextareaContainer>
        <span>{text.length}/340</span>
        <Textarea
          placeholder="write suggestion here ( max 340 characters )"
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= 340) setText(e.target.value)
          }}
        />
      </TextareaContainer>
      <br></br>
      <Button width={200} onClick={onSubmit} disabled={!text.length}>
        Submit
      </Button>
    </>
  )
}

const DonePage = () => {
  const [isTestDone, setIsTestDone] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    let timeout = setTimeout(() => {
      setIsButtonDisabled(false)
    }, 10 * 1000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Container>
      <h1>Thank you for participating!</h1>
      <br></br>
      <br></br>
      {!isTestDone && (
        <>
          <p>
            You will now perform a test given by the instructor, wait until you
            are done before proceeding.
          </p>
          <br></br>
          <Button
            width={200}
            onClick={() => setIsTestDone(true)}
            disabled={isButtonDisabled}
          >
            Proceed
          </Button>
        </>
      )}
      {isTestDone && <WriteTheory />}
    </Container>
  )
}

export default DonePage
