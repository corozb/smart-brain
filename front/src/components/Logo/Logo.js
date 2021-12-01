import React from 'react'
import Tilt from 'react-parallax-tilt'
import brain from './logo.png'
import './Logo.css'

function Logo() {
  return (
    <div className='ma4 mt0'>
      <Tilt className='Tilt br2 shadow-2' style={{ width: '150px', height: '150px' }}>
        <div className='Tilt-inner pa3'>
          <img style={{ paddingTop: '5px', width: '80%' }} src={brain} alt='logo' />
        </div>
      </Tilt>
    </div>
  )
}

export default Logo