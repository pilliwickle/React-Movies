import React, { Component } from 'react'
import { Pagination } from 'antd'

import MoviesList from '../movie-list/movies-list'
import Movies from '../../services/movies'

import './rated-page.css'

export default class RatedPage extends Component {
  moviesApi = new Movies()

  state = {
    movieRatedData: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalResults: null,
  }

  // Ищем оцененные фильмы по гостевой сессии (ид достается в апи сам, он самостоятельный)
  componentDidMount() {
    this.setState({ loading: true }) // Включаем спиннер
    this.moviesApi.getRatedMovies().then(this.addAllMovies).catch(this.onError)
  }

  // Листаем страницы оцененных фильмов
  componentDidUpdate(prevProps, prevState) {
    if (this.state.totalResults && this.state.currentPage !== prevState.currentPage) {
      this.setState(this.loadingState())
      this.moviesApi.getRatedMovies(this.state.currentPage).then(this.addAllMovies).catch(this.onError)
    }
  }

  // Листаем страницы оцененных фильмов
  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  // Листаем страницы оцененных фильмов
  addAllMovies = (moviesArray) => {
    const movies = []
    moviesArray.results.forEach((item) => {
      movies.push(item)
    }, [])
    this.setState({
      movieRatedData: movies,
      loading: false,
      error: null,
      currentPage: moviesArray.page,
      totalResults: moviesArray.totalResults,
    })
  }

  // Ошибка запроса после фетча будет связана с впн, т.к.
  // если мы дожили до чего-то, что вызывает фетч,
  // значит остальное приложение работает
  onError = () => {
    this.setState({
      error: new Error('Failed to get data from the server, try turning on the VPN or try again later'),
      loading: false,
    })
  }

  loadingState = () => {
    return { loading: true, movieData: null, error: null, totalPages: null }
  }

  render() {
    const { movieRatedData, loading, error, currentPage, totalResults } = this.state
    return (
      <main className="rated-page">
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalResults}
          pageSize={20}
          defaultCurrent={1}
          hideOnSinglePage
          showSizeChanger={false}
        />
        <MoviesList movieData={movieRatedData} loading={loading} error={error} ratedPage={true} />
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalResults}
          pageSize={20}
          defaultCurrent={1}
          hideOnSinglePage
          showSizeChanger={false}
        />
      </main>
    )
  }
}
