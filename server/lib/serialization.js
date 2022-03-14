const Papa = require('papaparse')

function serialise(groups) {
  const data = groups.flatMap(group => group.trials && group.trials.map((trial, i) => ({
    groupId: group.id,
    groupName: group.name,
    type: group.type,
    trial: i + 1,
    time: trial.result,
    weight1: trial.config[0],
    weight2: trial.config[1],
    weight3: trial.config[2],
    weight4: trial.config[3],
    comment: trial.comment,
  }))).filter(x => !!x)
  return data.length > 0 ? Papa.unparse(data) : ''
}

function unserialise(csv) {
  const data = Papa.parse(csv, { header: true }).data
  const groups = {}
  data.forEach(d => {
    const id = d.groupId
    let group = groups[id] || { id, trials: [] }
    group.name = d.groupName
    group.type = d.type
    group.trials.push({
      config: [
        +d.weight1,
        +d.weight2,
        +d.weight3,
        +d.weight4,
      ],
      result: +d.time,
      comment: d.comment,
    })
    groups[id] = group
  })
  return Object.keys(groups)
    .map(id => groups[id])
}

module.exports = {
  serialise,
  unserialise,
}
