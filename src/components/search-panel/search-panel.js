import React, { Component } from 'react'
import { Input } from 'antd'
import { MonitorOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

import './search-panel.css'

export default class SearchPanel extends Component {
  state = {
    inputValue: '',
  }

  onChangeInputValue = (e) => {
    this.setState({
      inputValue: e.target.value,
    })

    this.sendQuery()
  }

  sendQuery = debounce(() => {
    if (this.state.inputValue.trim() !== '') {
      this.props.onSearch(this.state.inputValue)
    }
  }, 1000)

  onFocus = () => {
    this.setState({ inputValue: '' })
  }
  render() {
    return (
      <Input
        className="search-panel"
        placeholder="Type to search.."
        prefix={<MonitorOutlined className="search-panel__prefix prefix" />}
        onChange={this.onChangeInputValue}
        value={this.state.inputValue}
        onFocus={this.onFocus}
        onMouseOut={this.onMouseOut}
      />
    )
  }
}
