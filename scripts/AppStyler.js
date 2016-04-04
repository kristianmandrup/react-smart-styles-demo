import StyleBuilder from './StyleBuilder.js'
import { mixin } from 'core-decorators';


const TodoMixin = {
  heading(state) {
    console.log('heading', state);
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
};

@mixin(TodoMixin)
class Styles {
}

export default StyleBuilder.create(Styles);
