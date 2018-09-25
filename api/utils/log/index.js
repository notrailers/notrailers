const strpad = require('strpad')

class Log {
  constructor() {
    this.output = []
    this.timeStart = false
    this.padWidth = 60
  }

  add(text, align = '', padChar = '', width = this.padWidth) {
    if (!align) {
      if (typeof text === 'object') {
        this.output.push(JSON.stringify(text))
      } else {
        this.output.push(text)
      }
    } else if (align === 'center') {
      if (typeof text === 'object') {
        this.output.push(strpad.center(JSON.stringify(text), width, padChar))
      } else {
        this.output.push(strpad.center(text, width, padChar))
      }
    }
  }

  separator(char = '=') {
    this.add(char, 'center', char)
  }

  detail(text) {
    this.output.push(`  => ${text}`)
  }

  newline() {
    this.add('\n')
  }

  clear() {
    this.output = []
  }

  send(protocol = 'default') {
    const output = this.output.join('\n')
    if (protocol === 'slack') {
      console.log(
        `\`\`\`\n${output}\n\`\`\``,
      )
    } else {
      console.log(output)
    }
    this.clear()
  }

  timer(label = '') {
    if (this.timeStart) {
      this.add(`${`${label} `}${Date.now() - this.timeStart}ms`)
      this.timeStart = false
    } else {
      this.timeStart = Date.now()
    }
  }
}

module.exports = new Log()
