class Log {
  constructor() {
    this.output = []
    this.timeStart = false
  }

  add(text) {
    this.output.push(text)
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

  timer(label) {
    if (this.timeStart) {
      this.add(`${label} ${Date.now() - this.timeStart}ms`)
      this.timeStart = false
    } else {
      this.timeStart = Date.now()
    }
  }
}

module.exports = new Log()
