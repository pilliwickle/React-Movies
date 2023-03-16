import React, { Component } from 'react'
import { Tabs } from 'antd'
import { SearchOutlined, StarOutlined } from '@ant-design/icons'

export default class TabBar extends Component {
  _tabs = [
    {
      key: 'search',
      label: (
        <span>
          <SearchOutlined />
          Search
        </span>
      ),
    },
    {
      key: 'rated',
      label: (
        <span>
          <StarOutlined />
          Rated
        </span>
      ),
    },
  ]

  state = {
    selectedTab: 'search',
  }

  render() {
    return <Tabs defaultActiveKey="search" items={this._tabs} size="large" onChange={this.props.onChangeTab} />
  }
}
