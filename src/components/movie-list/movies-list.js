import React, { Component } from 'react'
import { v4 as createKey } from 'uuid'

import MovieCard from '../movie-card'
import { NoMoviesAlert, ErrorAlert, LoadingSpinner, NoRatedMoviesAlert } from '../user-messages'

import './movies-list.css'

export default class MoviesList extends Component {
  render() {
    const { movieData, error, loading, ratedPage } = this.props
    const movieDataIsOK = !loading || !error
    const errorAlert = error && <ErrorAlert error={error} />
    const loadingSpin = loading && <LoadingSpinner />
    // В зависимости от условий возвращаем
    // всякие сообщения или спиннер
    if (movieDataIsOK && movieData && movieData.length) {
      const items = movieData.map((item) => {
        return <MovieCard key={createKey()} {...item} />
      })
      return <ul className="movies-list">{items}</ul>
    }
    if (error) {
      return errorAlert
    }

    if (loading) {
      return loadingSpin
    }
    if (ratedPage && movieData && !movieData.length) {
      return <NoRatedMoviesAlert />
    }
    if (movieData && !movieData.length) {
      return <NoMoviesAlert />
    }

    return
  }
}
