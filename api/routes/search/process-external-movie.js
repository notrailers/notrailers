const validCrewJobs = [
  'Director',
  'Writer',
]

const altWriterTitles = [
  'Screenplay',
  'Novel',
]

module.exports = ({
  genres,
  spoken_languages: spokenLanguages,
  credits: {
    cast,
    crew,
  },
  year,
  ...rest
}) => ({
  // Obviate language name & stringify for psql
  spoken_languages: JSON
    .stringify(spokenLanguages
      .map(({ iso_639_1: iso }) => iso)),

  // Obviate genre IDs
  genres: genres
    .map(({ name }) => name),

  // Give Letterboxd a default for now
  letterboxd_rating: 0,

  // From release_date => year
  // OR 2016-04-13 => 2016
  year: year.split('-')[0],

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
  ...rest,
})
