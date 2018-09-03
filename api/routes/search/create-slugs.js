module.exports = ({ title, ...rest }) => ({
  slug: [title]
    .map(t => t
      .replace(/'/g, '')
      .replace(/\W/g, ' ')
      .replace(/  +/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 6)
      .join(' ')
      .replace(/ /g, '-')
      .toLowerCase())[0],
  title,
  ...rest,
})
