const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const eventCbs = {
  // ready: () => {},
  // start: () => {},
  time: (args) => {
    console.log('Got duration', args[0])
  },
}

module.exports = {
  init: ({
    events: eventCbs = {},
    devpath = '/dev/tty.usbserial-D308DE73'
  }) => {
    const serialport = new SerialPort(devpath, {
      baudRate: 115200,
    })

    const parser = serialport.pipe(new Readline({ delimiter: '\n' }))

    parser.on('data', function (data) {
      const parts = data.split(' ')
      if (parts.length == 1) {
        console.log('unknown line: ', data)
        return
      }

      if (parts[0] === 'event:') {
        if (eventCbs[parts[1]]) {
          eventCbs[parts[1]](parts.slice(2))
        } else {
          console.log('unknown event', parts[1])
        }
      } else {
        console.log('unknown line: ', data)
      }
    })
  }
}
