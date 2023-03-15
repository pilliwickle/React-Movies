import React, { Component } from 'react'
import { Card, Image, Typography } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import Movies from '../../services/movies'

import './movie-card.css'

const { Title, Paragraph, Text } = Typography

export default class MovieCard extends Component {
  movies = new Movies()
  state = {
    path: null,
    loadingImage: true,
    errorImage: false,
  }
  createTagList = (tagArray) => {
    const tagList = tagArray.map((item) => {
      return (
        <Text key={uuidv4()} className="movie-card__tag tag">
          {item}
        </Text>
      )
    })

    return <div className="movie-card__tag-list tag-list">{tagList}</div>
  }
  stopSpinner = () => {
    this.setState({ loadingImage: false })
    console.log(this.state)
    console.log('loaded')
  }

  render() {
    const { title, releaseDate, description, tags, posterPath } = this.props

    const isLoading = (
      <Image
        width={183}
        height={281}
        src={posterPath}
        alt={title + 'постер'}
        className="movie-card__poster"
        style={{ borderRadius: 8 }}
        preview={false}
      />
    )

    return (
      <Card hoverable key={uuidv4()} className="movie-card" cover={isLoading}>
        <Title level={5} style={{ marginTop: '0' }} className="movie-card__title title" ellipsis={{ rows: 1 }}>
          {title}
        </Title>
        <Paragraph className="movie-card__date date">{releaseDate}</Paragraph>
        {this.createTagList(tags)}
        <Paragraph className="movie-card__description description">{description}</Paragraph>
      </Card>
    )
  }
}
