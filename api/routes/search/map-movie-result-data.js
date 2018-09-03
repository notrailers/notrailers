const map = {
  id: 'tmdb_id',
  imdb_id: '',
  poster_path: '',
  title: '',
  original_title: '',
  release_date: 'year',
  spoken_languages: '',
  genres: '',
  credits: '',
  popularity: 'tmdb_popularity',
  vote_average: 'tmdb_rating',
  vote_count: 'tmdb_votes',
  letterboxd_rating: '',
}


module.exports = movie => Object
  .keys(map)
  .reduce((acc, key) => ({
    ...acc,
    [map[key] || key]: movie[key],
  }), {})
