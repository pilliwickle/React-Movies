import React, { Component } from 'react'
import { Pagination } from 'antd'

import MoviesList from '../movie-list'
import SearchPanel from '../search-panel'
import Movies from '../../services/movies'

import './app.css'

export default class App extends Component {
  moviesApi = new Movies()

  state = {
    movieData: null,
    loading: false,
    error: null,
    query: '',
    currentPage: 1,
    totalPages: null,
  }
  componentDidMount = () => {
    window.addEventListener('online', () => {
      this.setState({ error: null })
    })
    window.addEventListener('offline', () => {
      this.setState({
        error: new Error('You should connect to the Internet back! Or just pay for it.'),
        movieData: null,
      })
    })
  }

  onSearch = (text) => {
    this.setState({
      query: text,
      loading: true,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.setState(this.loadingState())
      this.moviesApi.getSource(this.state.query, 1).then(this.addAllMovies).catch(this.onError)
    }

    if (this.state.currentPage !== prevState.currentPage) {
      this.setState(this.loadingState())
      this.moviesApi.getSource(this.state.query, this.state.currentPage).then(this.addAllMovies).catch(this.onError)
    }
  }
  loadingState = () => {
    return { loading: true, movieData: null, error: null, totalPages: null }
  }

  addAllMovies = (moviesArray) => {
    const movies = []
    moviesArray.results.forEach((item) => {
      movies.push(item)
    }, [])
    this.setState({
      movieData: movies,
      loading: false,
      error: null,
      currentPage: moviesArray.page,
      totalPages: moviesArray.totalPages,
    })
  }

  onError = (e) => {
    console.log(e)
    this.setState({
      error: new Error('Failed to get data from the server, try turning on the VPN or try again later '),
      loading: false,
    })
  }
  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  render() {
    const { movieData, loading, error, currentPage, totalPages } = this.state
    return (
      <section className="app">
        <SearchPanel onSearch={this.onSearch} />
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalPages}
          defaultCurrent={1}
          hideOnSinglePage
        />
        <MoviesList movieData={movieData} loading={loading} error={error} onMoviesList={this.onMoviesList} />
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalPages}
          defaultCurrent={1}
          hideOnSinglePage
        />
      </section>
    )
  }
}
