// eslint-disable-next-line
const server = require('./server').listen(require('config').get('port'))
const initMessage = require('./utils/init-message')

server.on(
  'listening',
  () => console.log(initMessage),
)
