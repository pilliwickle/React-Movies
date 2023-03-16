import React from 'react'
import { Alert, Spin } from 'antd'
import './user-messages.css'

export const NoMoviesAlert = () => {
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

export const NoRatedMoviesAlert = () => {
  return (
    <div className="status-block">
      <Alert
        message="You did not rate any movies!"
        description="You should rate some movies to see something in here"
        type="warning"
        showIcon
        className="status-block__message"
      />
    </div>
  )
}

export const ErrorAlert = ({ error }) => {
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

export const LoadingSpinner = () => {
  return (
    <div className="status-block">
      <Spin className="status-block__spin" size="large" />
    </div>
  )
}

export const ImageSpinner = () => {
  return (
    <div className="movie-card__image-placeholder">
      <Spin className="movie-card__image-spin" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    </div>
  )
}
