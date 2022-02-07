import { render } from 'react-dom'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Start from './Start'
import Experiment from './Experiment'
import useSocket from './hooks/useSocket'

const Root = () => {
  useSocket()

  return (
    <React.StrictMode>
      <ChakraProvider>
        <Router>
          <Switch>
            <Route path="/group/:id">
              <Experiment />
            </Route>
            <Route path="/">
              <Start />
            </Route>
            <Route path="/:sessionId/connect">
              <div>Väl exp</div>
            </Route>
          </Switch>
        </Router>
      </ChakraProvider>
    </React.StrictMode>
  )
}

const rootElement = document.getElementById('root')
render(<Root />, rootElement)
