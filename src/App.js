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
// css
import './App.css';

const app = new Clarifai.App({
  apiKey: '5260d921c51f414a96c9373a7f89fc5d'
});

const particlOptions = {
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
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      (response) => {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
          params={particlOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
