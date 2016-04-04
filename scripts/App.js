import React, {Component} from 'react';
import MyComponent from './MyComponent';
import shortid from 'shortid';
import { injectProps, statefulStyling, updateStyles } from './decorators.js'

import Styler from './AppStyler.js'

@statefulStyling('browser', Styler)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
      wasClicked: false
    }
    this.count = 0;
  }

  _clicked() {
    // console.log('container clicked');
    this.updateState({wasClicked: true, count: this.count++ });
  }

  _on() {
    // console.log('container ON');
    this.updateState({on: true});
  }

  @updateStyles
  componentWillMount() {
  }

  @updateStyles
  componentWillUpdate() {
  }

  @injectProps('state', 'props')
  render({ styles = {} }) {
    // console.log('render App styles', styles);
    return (
      // Add your component markup and other subcomponent references here.
      <div>
        <h1 style={styles.heading}>Hello, World!</h1>
        <button onClick={this._on.bind(this)} >Turn me ON</button>
        <button onClick={this._clicked.bind(this)} >Click me</button>
        <MyComponent {...this.state}/>
      </div>
    );
  }
}
