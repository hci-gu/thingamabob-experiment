import { render } from 'react-dom'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Start from './Start'
import Experiment from './Experiment'
import useSocket from './hooks/useSocket'
import DonePage from './DonePage'

const Root = () => {
  useSocket()

  return (
    <React.StrictMode>
      <ChakraProvider>
        <Router>
          <Switch>
            <Route path="/group/:id/done/:index">
              <DonePage />
            </Route>
            <Route path="/group/:id">
              <Experiment />
            </Route>
            <Route path="/">
              <Start />
            </Route>
          </Switch>
        </Router>
      </ChakraProvider>
    </React.StrictMode>
  )
}

const rootElement = document.getElementById('root')
render(<Root />, rootElement)
