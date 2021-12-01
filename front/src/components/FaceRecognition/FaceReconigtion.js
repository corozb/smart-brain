import React from 'react'
import './FaceRecognition.css'

function FaceReconigtion({ box, imageUrl }) {
  const { topRow, leftCol, bottomRow, rightCol } = box
  return (
    <div className='center ma4'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt='' width='500px' height='auto' />
        <div className='bounding-box' style={{ top: topRow, right: rightCol, bottom: bottomRow, left: leftCol }}></div>
      </div>
    </div>
  )
}

export default FaceReconigtion
