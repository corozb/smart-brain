import { Component } from 'react'
import Particles from 'react-tsparticles'
import Clarifai from 'clarifai'

import './App.css'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceReconigtion from './components/FaceRecognition/FaceReconigtion'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: '8192de57c8324123b9644d18d72ee4e5',
})

const particlesOptions = {
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: true,
    },
  },
  particles: {
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      random: true,
      value: 5,
    },
  },
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      },
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const imageElement = document.getElementById('inputImage')
    const width = +imageElement.width
    const height = +imageElement.height
    return {
      topRow: clarifaiFace.top_row * height,
      leftCol: clarifaiFace.left_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
      rightCol: width - clarifaiFace.right_col * width,
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box })
  }

  onInputChange = (e) => {
    this.setState({ input: e.target.value })
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.name,
        entries: data.entries,
        joined: data.joined,
      },
    })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(
        /**
         * * HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
         * * A good way to check if the model you are using is up, is to check them on the clarifai website. For example, for the Face Detect Mode: https://www.clarifai.com/models/face-detection.
         * * If that isn't working, then that means you will have to wait until their servers are back up. Another solution is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js so you would change from:
         * ! .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
         * * to:
         * ! .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
         */
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then((response) => {
        if (response) {
          fetch('http://localhost:5000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(
                Object.assign(this.state.user, {
                  entries: count,
                })
              )
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch((err) => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className='App'>
        <Particles id='tsparticles' className='particles' options={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceReconigtion box={box} imageUrl={imageUrl} />
          </>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    )
  }
}

export default App
