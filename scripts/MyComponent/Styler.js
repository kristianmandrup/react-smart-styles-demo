// import {headers} from '../../styles/Global.styles.js'
// TODO: extract to npm module
import StyleBuilder from '../StyleBuilder.js'
import { mixin } from 'core-decorators';


const TodoMixin = {
  title(state) {
    return {
      color: state.todo && state.todo.completed ? 'red' : 'green'
    }
  }
};

@mixin(TodoMixin)
class Styles {
}

export default StyleBuilder.create(Styles);
