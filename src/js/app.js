
import Config from 'data/config';
import Detector from 'utils/detector';
import { create, gaem } from './app/main';
import React, { Component } from "react"
import ReactDOM from "react-dom"
import {TextForm, fonts} from 'components/React/TextForm'
import {Button} from 'components/React/button'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
// Styles
import 'css/main.css'

// Check environment and set the Config helper
if(__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----')

  Config.isDev = true
}

const defaultText = ""

const mappedFonts = fonts.map(font => {
  return {name: font.familyName, font: font}
})

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = { value: defaultText, font: helvetiker}
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
      // add Three to the DOM
      this.sketch = create()
  }
  handleChange(event) {
       console.log('e: ', event)
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
