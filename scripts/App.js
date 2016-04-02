import React, {Component} from 'react';
import MyComponent from './MyComponent';

export default class App extends Component {
  render() {
    return (
      // Add your component markup and other subcomponent references here.
      <div>
        <h1>Hello, World!</h1>
        <MyComponent />
      </div>
    );
  }
}
