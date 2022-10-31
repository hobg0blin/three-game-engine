import Config from 'data/config';
import Detector from 'utils/detector';
import Sketch from './app/main';
import React, { Component } from "react"
import ReactDOM from "react-dom"
// Styles
import 'css/main.css'

// Check environment and set the Config helper
if(__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----')

  Config.isDev = true
}


class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
     console.log('add sketch')
      // add Three to the DOM
      this.sketch = new Sketch()
  }
  handleChange(event) {
    }
  render() {
    return (
      <div className="grid grid-cols-1">
      </div>
    );
  }
}

const rootEl = document.getElementById("root")
ReactDOM.render(<App/>, rootEl)

