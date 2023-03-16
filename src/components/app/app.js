import React, { Component } from 'react'

import Movies from '../../services/movies'
import TabBar from '../tab-bar'
import SearchPage from '../search-page'
import RatedPage from '../rated-page'
import { TagProvider } from '../tag-context/tag-context'

import './app.css'

export default class App extends Component {
  moviesApi = new Movies()

  state = {
    tags: null,
    selectedTab: 'search',
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

    if (!localStorage.getItem('guestID')) {
      this.moviesApi.getGuestSession().then((res) => {
        localStorage.setItem('guestID', res)
      })
    }
    this.moviesApi.getTags().then((res) => {
      this.setState({ tags: res.genres })
    })
  }
  // Отслеживаю переключение табов
  onChangeTab = (tabName) => {
    this.setState({
      selectedTab: tabName,
    })
  }

  render() {
    const { tags, selectedTab } = this.state

    const tabNames = {
      searchTab: 'search',
      ratedTab: 'rated',
    }

    const content = (selectedTab) => {
      if (selectedTab === tabNames.ratedTab) return <RatedPage />
      return <SearchPage />
    }
    return (
      <section className="app">
        <TabBar selectedTab={selectedTab} onChangeTab={this.onChangeTab} />
        <TagProvider value={tags}>{content(selectedTab)}</TagProvider>
      </section>
    )
  }
}
