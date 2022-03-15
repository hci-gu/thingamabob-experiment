import { Button, Textarea } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Controls from './Experiment/Controls'
import { useDoneTrial } from './hooks/useDoneTrial'
import { selectedTrialAtom } from './state'
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
  const [, setSelectedTrial] = useAtom(selectedTrialAtom)

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
        Skriv ett kort (2-3 meningar) förslag på din teori för nästa deltagare.
      </span>
      <br></br>
      <span style={{ fontWeight: 'bold' }}>
        Hjulet rullar snabbare nerför banan när...
      </span>
      <TextareaContainer>
        <span>{text.length}/340</span>
        <Textarea
          placeholder="skriv din teori här ( max 340 bokstäver )"
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
  const trial = useDoneTrial()
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
      <h1>Tack för din medverkan!</h1>
      <br></br>
      <div style={{ width: 385 }}>
        {trial && (
          <Controls trial={trial} title="Din slutgiltiga konfiguration" />
        )}
      </div>
      <br></br>
      {!isTestDone && (
        <>
          <p>
            Du kommer nu att utföra ett test som ges av instruktören, vänta
            tills du är klar innan du fortsätter.
          </p>
          <br></br>
          <Button
            width={200}
            onClick={() => setIsTestDone(true)}
            disabled={isButtonDisabled}
          >
            Fortsätt
          </Button>
        </>
      )}
      {isTestDone && <WriteTheory />}
    </Container>
  )
}

export default DonePage
