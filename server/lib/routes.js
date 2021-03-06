const express = require('express')
const router = express.Router()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { load, save } = require('./file')

const groups = load()

router.use(cors())
router.use(express.json())
router.get('/', (req, res) => res.send('hej'))

router.get('/groups', (req, res) => {
  res.json(groups.map(({ id, name }) => ({ name, id })))
})

router.get('/groups/:id', (req, res) => {
  const { id } = req.params
  const group = groups.find(({ id: groupId }) => groupId === id)
  if (!group) {
    res.status(404).end()
    return
  }
  res.json(group)
})

router.post('/groups', (req, res) => {
  const { name, type } = req.body
  const newGroup = {
    id: uuidv4(),
    name,
    type,
    trials: [],
  }
  groups.push(newGroup)
  save(groups)
  res.json(newGroup)
})

router.delete('/groups/:id/trials/:index', (req, res) => {
  const { id, index } = req.params

  const group = groups.find(({ id: groupId }) => groupId === id)
  group.trials.splice(index, 1)
  save(groups)
  res.sendStatus(200)
})

router.post('/groups/:id/trials', (req, res) => {
  const { id } = req.params
  const { config, result } = req.body
  const group = groups.find(({ id: groupId }) => groupId === id)
  if (!group) {
    res.status(404).end()
    return
  }
  group.trials.push({ config, result })
  save(groups)
  res.json(group.trials)
})

router.post('/groups/:id/:index/comment', (req, res) => {
  const { id, index } = req.params
  const { comment } = req.body

  const group = groups.find(({ id: groupId }) => groupId === id)
  const trial = group ? group.trials[index - 1] : null
  if (!group || !trial) {
    res.status(404).end()
    return
  }
  trial.comment = comment
  save(groups)
  res.json(trial)
})

module.exports = router
