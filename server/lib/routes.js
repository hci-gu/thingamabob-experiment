const { json } = require('express')
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
  const id = req.param('id')
  const group = groups.find(({ id: groupId }) => groupId === id)
  if (!group) {
    res.status(404).end()
    return
  }
  res.json(group)
})

router.post('/groups', (req, res) => {
  const { name } = req.body
  const newGroup = {
    id: uuidv4(),
    name,
  }
  groups.push(newGroup)
  save()
  res.json(newGroup)
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
  save()
  res.json(group.trials)
})

module.exports = router
