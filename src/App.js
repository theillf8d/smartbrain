// libraries
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
// components
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
// css
import './App.css';

const app = new Clarifai.App({
  apiKey: '5260d921c51f414a96c9373a7f89fc5d'
});

const particleOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 400
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  getBoundingBoxes = (data) => {
    return data.outputs[0].data.regions.map(box => box.region_info.bounding_box);
  }

  calculateFaceLocation = (data) => {
    const clarifaiFaceBoxes = this.getBoundingBoxes(data);
    const clarifaiFaceBox = clarifaiFaceBoxes[0];
    const inputImage = document.getElementById('inputImage');
    const width = Number(inputImage.width);
    const height = Number(inputImage.height);

    return {
      leftCol: clarifaiFaceBox.left_col * width,
      topRow: clarifaiFaceBox.top_row * height,
      rightCol: width - (clarifaiFaceBox.right_col * width),
      bottomRow: height - (clarifaiFaceBox.bottom_row * height)
    }
  }

  displayBoundingBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayBoundingBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (

      < div className="App" >
        <Particles className="particles"
          params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === "home"
            ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            : (route === "signin"
              ? <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            )
        }
      </div >
    );
  }
}

export default App;
