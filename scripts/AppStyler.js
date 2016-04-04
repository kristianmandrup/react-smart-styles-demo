import { StyleBuilder } from 'reactive-style-builder';
import { mixin } from 'core-decorators';


const TodoMixin = {
  heading(state) {
    return {
      color: state.on ? 'blue' : 'gray',
    }
  }
};

@mixin(TodoMixin)
class Styles {
}

export default StyleBuilder.create(new Styles(), {name: 'App'});
