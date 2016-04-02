import Styler from './Styler.js'
import { injectProps, statefulStyling, updateStyles } from '../decorators.js'

import React, {
  Component
} from 'react'

// props are global (or higher level state)
// state is local state (ie. local styling)
// to calculate local style state, use global and local state
// to compute new style object (one level deep only!)

// See ES7 Decorators + React
// https://medium.com/@goncalvesjoao/react-es7-decorators-how-to-inject-props-to-your-render-method-27a0a7973106#.d9dir76zc
@statefulStyling('browser', Styler)
export default class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todo: {
        completed: false
      }
    }
  }

  @updateStyles
  componentWillMount() {
  }

  // FIX: instead we need an after setState hook
  // What about if props change?
  updateState(state) {
    this.setState(state);
    this.updateStyles(state);
    // this.setState({styles: {title: { color: 'red'}}});
  }

  // FIX: instead we need an after setState hook
  // just before component is rendered after a state update,
  // we re-compute styles based on state
  // @updateStyles
  // componentWillUpdate() {
  // }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps && this.state === nextState) {
      return false;
    }
    return true;
  }

  _clicked() {
    console.log('clicked');
    this.updateState({todo: {completed: true}});
  }

  // https://github.com/goncalvesjoao/relpers
  @injectProps('state', 'props')
  render({ styles = {} }) {
    console.log('render styles', styles);
    return (
      <div style={styles.header}>
        <div style={styles.title}>Blip</div>
        <button onClick={this._clicked.bind(this)} >Click me</button>
      </div>
    )
  }
}
