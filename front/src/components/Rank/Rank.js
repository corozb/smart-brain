import React, { Component } from 'react'

class Rank extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <div className='white f3'>{this.props.name}, your current count is...</div>
        <div className='white f1'>#{this.props.entries}</div>
      </div>
    )
  }
}

export default Rank
