import Styler from './Styler.js'
import { statefulStyling, updateStyles } from 'style-builder';
import { injectProps } from 'relpers'

import React, {
  Component
} from 'react'

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
    console.log('will mount');
  }

  // FIX: instead we need an after setState hook
  // just before component is rendered after a state update,
  // we re-compute styles based on state
  @updateStyles
  componentWillUpdate() {
    console.log('will update');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps && this.state === nextState) {
      return false;
    }
    return true;
  }

  _complete() {
    // console.log('Complete task');
    this.updateState({todo: {completed: true}});
  }

  _start() {
    // console.log('Start task');
    this.updateState({todo: {completed: false}});
  }

  // https://github.com/goncalvesjoao/relpers
  @injectProps('state', 'props')
  render({ styles = {} }) {
    // console.log('render styles', styles);
    return (
      <div style={styles.header}>
        <div style={styles.title}>Blip</div>
        <button onClick={this._complete.bind(this)} >Complete</button>
        <button onClick={this._start.bind(this)} >Start</button>
      </div>
    )
  }
}
