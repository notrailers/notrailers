exports.update = ({
  baseTime, tmdbIdsInsertedLength,
}) => {
  const timeAgo = `=> Scrape started: ${baseTime.fromNow()}`
  const longestLineLength = timeAgo.length + 3
  let output = '\n'
  output += `${'='.repeat(longestLineLength)}\n`
  // eslint-disable-next-line
  output += (wordLength => `${' '.repeat((longestLineLength / 2) - (~~(wordLength / 2)))}Update\n`)('update'.length)
  output += `${'='.repeat(longestLineLength)}\n`
  output += `${timeAgo}\n`
  output += `${'-'.repeat(longestLineLength)}\n`
  output += `=> Total movies inserted: ${tmdbIdsInsertedLength}\n`
  output += `${'-'.repeat(longestLineLength)}\n`
  return output
}
