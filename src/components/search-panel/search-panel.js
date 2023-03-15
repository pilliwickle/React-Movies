import React, { Component } from 'react'
import { Input } from 'antd'
import { MonitorOutlined } from '@ant-design/icons'

import './search-panel.css'

export default class SearchPanel extends Component {
  render() {
    return (
      <form>
        <Input
          className="search-panel"
          placeholder="Type to search"
          prefix={<MonitorOutlined className="search-panel__prefix prefix" />}
        />
      </form>
    )
  }
}
