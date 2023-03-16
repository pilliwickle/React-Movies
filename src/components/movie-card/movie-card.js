import React, { Component } from 'react'
import { Card, Image, Typography, Tag, Badge, Rate, notification } from 'antd'
import { CheckOutlined, ExclamationOutlined } from '@ant-design/icons'
import { v4 as createKey } from 'uuid'

import Movies from '../../services/movies'
import './movie-card.css'
import { TagConsumer } from '../tag-context/tag-context'
import { ImageSpinner } from '../user-messages'

import testimage from './test-image.png'

const { Title, Paragraph } = Typography

const getVoteColor = (voteAverage) => {
  if (voteAverage <= 3) return '#E90000'
  if (voteAverage <= 5) return '#E97E00'
  if (voteAverage <= 7) return '#E9D100'
  return '#66E900'
}

// Функция, которая возвращает размер постера
// для мобилки/не мобилки
const getImageSize = () => {
  const screenWidth = window.innerWidth
  if (screenWidth < 1024) {
    return { width: 150, height: 245 }
  }

  return { width: 183, height: 281 }
}

export default class MovieCard extends Component {
  movies = new Movies()
  state = {
    ratingValue: 0,
  }
  createTagList = (tagIdsArray, tagNames) => {
    const res = tagIdsArray.map((id) => {
      const tag = tagNames.filter((item) => item.id === id)[0]
      return tag.name
    }) // tagIdsArray - из запроса на фильмы, tagNames - из контекста, потом с ними вызов будет

    const tagList = res.map((item) => {
      return (
        <Tag key={createKey()} className="movie-card__tag tag" color="purple">
          {item}
        </Tag>
      )
    })

    return <div className="movie-card__tag-list tag-list">{tagList}</div>
  }
  onRateMovie = (value, sucsess) => {
    const openNotification = (text) => {
      notification.open({
        message: 'You sent your movie rating!',
        description: text,
        icon: sucsess ? <ExclamationOutlined style={{ color: 'red' }} /> : <CheckOutlined style={{ color: 'green' }} />,
      })
    } // Оповещение об оценке фильма

    this.movies
      .rateMovie(this.props.id, value) // Пост запрос
      .catch(() => {
        openNotification('Something went wrong, so we can not save your rating', false)
      }) // Что-то случилось (оповещение с ошибкой)
      .then((res) => {
        if (res) {
          this.setState({ ratingValue: value }) // Чтобы когда оценил на странице поиска, там оценка осталась
          openNotification('Hell yeah! We saved your rating, check the Rating tab!', true)
        }
      }) // Ничего не случилось (оповещение, что ничего не случилось)
  }
  render() {
    const { title, releaseDate, description, tagIds, posterPath, voteAverage, rating } = this.props
    const { ratingValue } = this.state
    const imageSize = getImageSize()

    return (
      <Badge count={voteAverage} color={getVoteColor(voteAverage)} className="movie-card__vote-average vote-average">
        <Card
          hoverable
          className="movie-card"
          cover={
            <Image
              width={imageSize.width}
              height={imageSize.height}
              placeholder={<ImageSpinner />}
              src={posterPath ? posterPath : testimage}
              alt={title + ' постер'}
              className="movie-card__poster"
              style={{ borderRadius: 8 }}
              preview={false}
            />
          }
        >
          <Title level={5} style={{ marginTop: '0' }} className="movie-card__title title" ellipsis={{ rows: 1 }}>
            {title}
          </Title>
          <Paragraph className="movie-card__date date">{releaseDate}</Paragraph>
          <TagConsumer>{(value) => this.createTagList(tagIds, value)}</TagConsumer>
          <Paragraph className="movie-card__description description">{description}</Paragraph>
          <Rate
            allowHalf
            count={10}
            value={rating ? rating : ratingValue}
            onChange={this.onRateMovie}
            style={{ fontSize: '14px', marginBottom: '0', marginRight: '0' }}
          />
        </Card>
      </Badge>
    )
  }
}
