// Make the response data more ours
const map = {
  id: 'tmdb_id',
  imdb_id: true,
  poster_path: true,
  title: true,
  original_title: true,
  release_date: true,
  original_language: true,
  spoken_languages: true,
  genres: true,
  credits: true,
  images: true,
  popularity: 'tmdb_popularity',
  vote_average: 'tmdb_rating',
  vote_count: 'tmdb_votes',
}

module.exports = movie => Object
  .keys(map)
  .reduce((acc, key) => ({
    ...acc,
    // If boolean, use map's key; if non-boolean, use value
    [(!!map[key] === map[key]) ? key : map[key]]: movie[key],
  }), {})
