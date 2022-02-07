const { json } = require('express')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const Papa = require('papaparse')
const fs = require('fs')

const filename = '../data.csv'

let groups = [{
  id: 'asdf',
  name: 'named group',
  trials: [
    {
      config: [4, 3, 2, 7],
      result: 345,
    },
  ],
}]

function serialise(groups) {
  const data = groups.flatMap(group => group.trials.map((trial, i) => ({
    groupId: group.id,
    groupName: group.name,
    trial: i + 1,
    time: trial.result,
    weight1: trial.config[0],
    weight2: trial.config[1],
    weight3: trial.config[2],
    weight4: trial.config[3],
  })))
  return Papa.unparse(data)
}

function unserialise(csv) {
  const data = Papa.parse(csv, { header: true }).data
  const groups = {}
  data.forEach(d => {
    const id = d.groupId
    let group = groups[id] || { id, trials: [] }
    group.name = d.groupName
    group.trials.push({
      config: [
        +d.weight1,
        +d.weight2,
        +d.weight3,
        +d.weight4,
      ],
      result: +d.time,
    })
    groups[id] = group
  })
  return Object.keys(groups)
    .map(id => groups[id])
}

function load() {
  const content = fs.readFileSync(filename)
  groups = unserialise(content.toString())
  console.log({ groups })
}

load()

function save() {
  const csv = serialise(groups)
  fs.writeFileSync(filename, csv)
}

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
  const { id, config, result } = req.body
  const group = groups.find(({ id: groupId }) => groupId === id)
  if (!group) {
    res.status(404).end()
  }
  group.trials.push({ config, result })
  save()
  res.json(group.trials)
})

module.exports = router
