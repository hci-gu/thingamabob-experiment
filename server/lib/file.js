const fs = require('fs')

const { unserialise, serialise } = require('./serialization')

const filename = '../data.csv'

function load() {
  try {
    const content = fs.readFileSync(filename)
    return unserialise(content.toString())
  } catch (_) {
    return []
  }
}

function save() {
  const csv = serialise(groups)
  fs.writeFileSync(filename, csv)
}

module.exports = {
  save,
  load,
}
