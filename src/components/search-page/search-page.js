import React, { Component } from 'react'
import { Pagination } from 'antd'

import Movies from '../../services/movies'
import SearchPanel from '../search-panel'
import MoviesList from '../movie-list/movies-list'
import './search-page.css'

export default class SearchPage extends Component {
  moviesApi = new Movies()

  state = {
    movieData: null,
    loading: false,
    error: null,
    query: '',
    currentPage: 1,
    totalResults: null,
  }

  // Вбиваем в поиск строку через SearchPanel (если новый поиск)
  onSearch = (text) => {
    this.setState({
      query: text,
      loading: true,
    })
  }

  // Меняем страницу при том же запросе
  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  // Делаем запрос когда обновился стейт по квери или странице
  componentDidUpdate(prevProps, prevState) {
    //Делаем запрос по строке, первая страница
    if (this.state.query !== prevState.query) {
      this.setState(this.loadingState()) // Включаем спиннер
      this.moviesApi.getSource(this.state.query, 1).then(this.addAllMovies).catch(this.onError)
    }

    // Делаем запрос по странице со старой строкой
    if (this.state.currentPage !== prevState.currentPage) {
      this.setState(this.loadingState()) // Включаем спиннер
      this.moviesApi.getSource(this.state.query, this.state.currentPage).then(this.addAllMovies).catch(this.onError)
    }
  }

  // Функция ставит стейт для работы спиннера
  loadingState = () => {
    return { loading: true, movieData: null, error: null, totalPages: null }
  }

  // Добавляем все фильмы с запроса, сохраняем в стейт результаты + кол-во для пагинации
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

  render() {
    const { movieData, loading, error, currentPage, totalResults } = this.state
    return (
      <main className="search-page">
        <SearchPanel onSearch={this.onSearch} />
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalResults}
          pageSize={20}
          defaultCurrent={1}
          hideOnSinglePage
          showSizeChanger={false}
        />
        <MoviesList movieData={movieData} loading={loading} error={error} ratedPage={false} />
        <Pagination
          onChange={this.onPageChange}
          current={currentPage}
          total={totalResults}
          pageSize={20}
          defaultCurrent={1}
          hideOnSinglePage
          showSizeChanger={false}
        />
        <MoviesList />
      </main>
    )
  }
}
