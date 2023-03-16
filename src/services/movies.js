import { format } from 'date-fns'

export default class Movies {
  _apiMovies = 'https://api.themoviedb.org/3/'
  _apiKey = 'api_key=dc0f9d0a921ec8080017ba693c62f7de'
  _apiPosters = 'https://image.tmdb.org/t/p/original'

  // _transformData, _cutDescription приводят данные в вид, который
  // компоненты могут напрямую использовать, без преобразований

  async getSource(query, page) {
    const request = await fetch(
      `${this._apiMovies}search/movie?${this._apiKey}&query=${query}&page=${page}&language=en-EN`
    )

    if (!request.ok) {
      throw new Error('Movies getting troubles', request.status)
    }

    const res = await request.json()
    return { results: res.results.map(this._transformData), page: res.page, totalResults: res.total_results }
  }

  async getTags() {
    const request = await fetch(`${this._apiMovies}genre/movie/list?${this._apiKey}&language=en-US`)

    if (!request.ok) {
      throw new Error('Tags getting troubles', request.status)
    }

    const res = await request.json()
    return res
  }

  async getGuestSession() {
    const request = await fetch(`${this._apiMovies}authentication/guest_session/new?${this._apiKey}`)

    if (!request.ok) {
      throw new Error('Failed to create the guest session', request.status)
    }

    const res = await request.json()
    return res.guest_session_id
  }

  async rateMovie(movieId, rating) {
    const guestID = localStorage.getItem('guestID')
    const body = {
      value: rating,
    }
    const rateRequest = await fetch(
      `${this._apiMovies}movie/${movieId}/rating?${this._apiKey}&guest_session_id=${guestID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    )

    if (!rateRequest.ok) {
      throw new Error('Rating troubles', rateRequest.status)
    }

    const res = await rateRequest.json()
    return res
  }

  async getRatedMovies(page) {
    const guestID = localStorage.getItem('guestID')

    let request
    console.log(page)

    if (!page) {
      request = await fetch(`${this._apiMovies}guest_session/${guestID}/rated/movies?${this._apiKey}&language=en-US`)
    } else {
      request = await fetch(
        `${this._apiMovies}guest_session/${guestID}/rated/movies?${this._apiKey}&page=${page}&language=en-US`
      )
    }

    const res = await request.json()
    return { results: res.results.map(this._transformRatedData), page: res.page, totalResults: res.total_results }
  }
  _transformData = (data) => {
    return {
      title: data.title,
      id: data.id,
      // eslint-disable-next-line quotes
      releaseDate: data.release_date ? format(new Date(data.release_date), "MMMM d',' y") : null,
      description: this._cutDescription(data.overview),
      voteAverage: data.vote_average,
      tagIds: data.genre_ids,
      posterPath: data.poster_path ? `${this._apiPosters}${data.poster_path}` : null,
    }
  }

  _transformRatedData = (data) => {
    return {
      title: data.title,
      id: data.id,
      // eslint-disable-next-line quotes
      releaseDate: data.release_date ? format(new Date(data.release_date), "MMMM d',' y") : null,
      description: this._cutDescription(data.overview),
      voteAverage: data.vote_average,
      tagIds: data.genre_ids,
      posterPath: data.poster_path ? `${this._apiPosters}${data.poster_path}` : null,
      rating: data.rating,
    }
  }
  _cutDescription = (text) => {
    if (text.length < 145) {
      return text
    }
    let newText = text.slice(0, 145)
    newText = newText.slice(0, newText.lastIndexOf(' '))
    return newText + '...'
  }
}
