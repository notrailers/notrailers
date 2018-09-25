// Shape/Process data to  our liking
const validCrewJobs = [
  'Director',
  'Writer',
]

const altWriterTitles = [
  'Screenplay',
  'Novel',
]

const filterPosters = ({ posters, originalLanguage }) => (
  (
    englishPosters => (
      originalLanguage !== 'en' && englishPosters.length === 0
        ? (
          posters.filter(({ language: l }) => l === originalLanguage)
        ) : (
          englishPosters
        )
    )
  )(
    posters
      .filter(({ language: l }) => l === 'en'),
  )
)

module.exports = ({
  release_date: releaseDate,
  genres,
  original_language: originalLanguage,
  spoken_languages: spokenLanguages,
  credits: {
    cast,
    crew,
  },
  images: {
    posters,
  },
  ...rest
}) => ({
  // Account for empty release date
  release_date: releaseDate || null,

  // Obviate language name & stringify for psql
  spoken_languages: JSON
    .stringify(spokenLanguages
      .map(({ iso_639_1: iso }) => iso)),

  // Obviate genre IDs
  genres: genres
    .map(({ name }) => name),

  // Give top four cast members the default job of 'actor'
  credits: cast
    .slice(0, 4)
    .map(({ name }) => ({
      name,
      job: 'actor',
    }))

    // Combine w/ crew
    .concat(
      crew
        .filter(({ job }) => validCrewJobs
          .includes(job))
        .map(({
          job,
          name,
        }) => (
          // Consolidate alternative writer job titles
          altWriterTitles.includes(job)
            ? ({
              name,
              job: 'writer',
            })
            : ({
              name,
              job: job.toLowerCase(),
            })
        )),
    ),

  posters: filterPosters({
    posters: posters
      .map(({
        file_path: path,
        iso_639_1: language,
        /* eslint-disable */
        aspect_ratio,
        vote_average,
        vote_count,
        /* eslint-enable */
      }) => ({
        path,
        language,
        aspect_ratio,
        vote_average,
        vote_count,
      })),
    originalLanguage,
  }),

  // Put it back where it belongs
  original_language: originalLanguage,

  ...rest,
})
