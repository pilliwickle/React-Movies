import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Alert, Spin } from 'antd'

import MovieCard from '../movie-card'
import './movies-list.css'

export default class MoviesList extends Component {
  render() {
    const { movieData, error, loading } = this.props
    const movieDataIsOK = !loading || !error
    const errorAlert = error && <ErrorAlert error={error} />
    const loadingSpin = loading && <LoadingSpinner />
    if (movieDataIsOK && movieData && movieData.length) {
      const items = movieData.map((item) => {
        return <MovieCard key={uuidv4()} {...item} />
      })
      return <ul className="movies-list">{items}</ul>
    }
    if (error) {
      return errorAlert
    }

    if (loading) {
      return loadingSpin
    }

    if (movieData && !movieData.length) {
      return <NoMoviesAlert />
    }

    return
  }
}
const NoMoviesAlert = () => {
  return (
    <div className="status-block">
      <Alert
        message="No movies found!"
        description="Nothing found for your request"
        type="warning"
        showIcon
        className="status-block__message"
      />
    </div>
  )
}

const ErrorAlert = ({ error }) => {
  return (
    <div className="status-block">
      <Alert
        message="Ups! Try again or.."
        description={error.message}
        type="error"
        showIcon
        className="status-block__message"
      />
    </div>
  )
}

const LoadingSpinner = () => {
  return (
    <div className="status-block">
      <Spin className="status-block__spin" size="large" />
    </div>
  )
}
