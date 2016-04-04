export function injectProps(...propertyNames) {
  return function (target, name, descriptor) {
    const originalFunction = descriptor.value;

    if (typeof originalFunction !== 'function') {
      throw new SyntaxError(`@injectProps can only be used on functions, not: ${originalFunction}`);
    }

    var fun = {
      ...descriptor,
      value: function propsInjectorWrapper(...args) {
        const properties = propertyNames.reduce((prev, name) => {
          var prop = this[name];
          prop !== null ? prev.push(prop) : prev;
          return prev;
        }, []);

        const newArgs = properties.concat(args);

        return originalFunction.apply(this, newArgs);
      },
    };
    return fun;
  }
}

// @computeOn('state')
// title: ({state}) => {

export function computeOn(propertyNames) {
  return function(target, name, descriptor) {
    // console.log('arguments', arguments);

    propertyNames = propertyNames || getArgs(target);
    target.registerDependencies(name, propertyNames)
    return descriptor
  }
}

// @updateStyles
export function updateStyles(target, name, descriptor) {
  let oldHandler = target
  // console.log('updateStyles', target, name);

  function updateStyler(nextProps, nextState) {
    // console.log('updateStyler', this);
    if (name === 'componentWillMount') {
      this.initStyles(nextProps, nextState);
    } else {
      if (nextProps || nextState) {
        this.updateStyles(nextProps, nextState);
      }
    }
    oldHandler.apply(this, arguments)
  }

  if (typeof target === 'function') {
    return updateStyler
  }

  oldHandler = descriptor.value
  descriptor.value = updateStyler //.bind(target);

  // console.log('descriptor', descriptor);
  return descriptor
}

// @statefulStyles('native')
export function statefulStyling(type, clazz) {
  return function(target) {
    // console.log('statefulStyling', target)
    // add function updateStyles to target (class ie. prototype)
    target.prototype.updateStyles = function(nextProps, nextState) {
      console.log('updateStyles', nextProps, nextState, type);
      if (nextProps || nextState) {
        var styles = this.styler[type](nextProps, nextState);
        // if styles changed, update
        if (styles && Object.keys(styles).length) {
          console.log('set styles', styles);
          this.setState({styles: styles});
        }
      }
    }

    target.prototype.initStyles = function(nextProps, nextState) {
      // console.log('initStyles', nextProps || this.props, nextState || this.state);
      this.styler = new clazz(nextProps, nextState);
      this.updateStyles(nextProps, nextState);
    }

    return target
  }
}
