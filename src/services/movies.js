import { format } from 'date-fns'

export default class Movies {
  _apiMovies = 'https://api.themoviedb.org/3/'
  _apiKey = 'api_key=dc0f9d0a921ec8080017ba693c62f7de'
  _apiPosters = 'https://image.tmdb.org/t/p/original'

  async getSource(query, page) {
    const request = await fetch(
      `${this._apiMovies}search/movie?${this._apiKey}&query=${query}&page=${page}&language=ru-RU`
    )

    if (!request.ok) {
      throw new Error('Movie getting troubles', request.status)
    }

    const res = await request.json()
    return res.results.map(this._transformData)
  }
  _transformData = (data) => {
    return {
      title: data.title,
      id: data.id,
      // eslint-disable-next-line quotes
      releaseDate: format(new Date(data.release_date), "MMMM d',' y"),
      description: this._cutDescription(data.overview),
      voteAverage: data.vote_average,
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      posterPath: data.poster_path ? `${this._apiPosters}${data.poster_path}` : null,
    }
  }
  _cutDescription = (text) => {
    if (text.length < 200) {
      return text
    }
    let newText = text.slice(0, 200)
    newText = newText.slice(0, newText.lastIndexOf(' '))
    return newText + '...'
  }
}
