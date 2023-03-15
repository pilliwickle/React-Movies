import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'

import MovieCard from '../movie-card'
import './movies-list.css'

export default class MoviesList extends Component {
  render() {
    const { movieData } = this.props
    if (movieData) {
      const items = movieData.map((item) => {
        return <MovieCard key={uuidv4()} {...item} />
      })
      return <ul className="movies-list">{items}</ul>
    }
  }
}
