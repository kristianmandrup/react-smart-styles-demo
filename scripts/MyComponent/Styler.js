// import {headers} from '../../styles/Global.styles.js'
// TODO: extract to npm module
import { StyleBuilder } from 'reactive-style-builder';
import { mixin } from 'core-decorators';


const TodoMixin = {
  title(state, props) {
    // console.log('title', state, props);
    return {
      color: state.todo && state.todo.completed ? 'red' : 'green',
      backgroundColor: props.count > 1 ? 'yellow' : 'white'
    }
  }
};

// @mixin(TodoMixin)
// class Styles {
// }

export default StyleBuilder.create(TodoMixin, {name: 'MyComponent'});
