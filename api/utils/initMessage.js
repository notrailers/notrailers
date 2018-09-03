const config = require('config')
const strpad = require('strpad')

const VERSION = config.get('version')
const IP = config.get('ip')
const PORT = config.get('port')

const charWidth = 40
const padChar = '='

const separator = strpad.center(padChar, charWidth, padChar)
const titleLine = strpad.center(`  NoTrailers API ${VERSION}  `, charWidth, padChar)
const runningOnLine = strpad.center(`  ${IP}:${PORT}  `, charWidth, padChar)

module.exports = (`
${separator}
${titleLine}
${separator}
${runningOnLine}
${separator}
`)
