import { getArgs } from './util';

export default class StyleBuilder {
  constructor(props, state, styles) {
    this.props = props
    this.state = state
    if (styles)
      this.styles = styles
    this.styleResult = this.staticStyles(); // initially only static
    this.dependencyMap = new Map()
    this.typeMap = {
      any: new Set(),
      props: new Set(),
      state: new Set()
    }
    this.registerStyles();
    // this.createGeneric()
  }

  createGeneric() {
    this.genericStyles = () => {
      return (this.generic || []).reduce((prev, style) => {
        prev[style] = (x) => { return this[style](x) }
      })
    }
  }

  // TODO: find functions in styles with no state/props dependency
  staticStyles() {
    return {}
  }

  registerStyles(styles) {
    styles = styles || this.styles
    // iterate all functions of styles Object
    for (let style in styles) {
      console.log('style', style);
      var args = getArgs(styles[style]);
      console.log('args', args);
      this.registerDependencies(style, args)
    }
  }

  // We have two different dependency maps
  // one keyed per type, one per name
  // ie. to allow styleObj.state
  registerDependencies(name, propertyNames) {
    this.dependencyMap.set(name, propertyNames)

    if (propertyNames.length == 2) {
      return this.typeMap.any.add(name) // list
    }

    for (let prop of propertyNames) {
      console.log('typeMap', this.typeMap, prop, name);
      this.typeMap[prop].add(name) // list
    }
  }

  browser(state, props) {
    console.log('call browser', state, props, this);
    state = state || this.state;
    props = props || this.props;
    console.log('browser', state, props);
    return this.compute(state, props)
  }

  // native(state, props) {
  //   return StyleSheet.create(this.compute())
  // }

  compute(state, props) {
    console.log('compute', state, props);
    let result = this.computeStyles(state, props)

    if (this.stateDiff(state)) {
      this.state = state
    }

    if (this.propsDiff(props)) {
      this.props = props
    }
    return result
  }

  stateDiff(state) {
    return this.state !== state
  }

  propsDiff(props) {
    return this.props !== props
  }

  bothDiff(state, props) {
    return this.stateDiff(state) && this.propsDiff(props)
  }

  computeStyles(state, props) {
    console.log('computeStyles', state, props);
    console.log(this.stateDiff(state), this.propsDiff(props));
    // ignore static styles
    // ie. styleObj.static

    // https://esdiscuss.org/topic/es6-iteration-over-object-values
    // https://www.pandastrike.com/posts/20150717-iterators

    if (this.bothDiff(state, props)) {
      console.log('compute on bothDiff');
      for (let key of this.typeMap.any) {
        let styleFun = this.styles[key]
        // check state/props dependency and only call if either one changed
        this.styleResult[key] = styleFun({state: state, props: props})
      }
    }

    // for this to work, each entry should be a Map, not just an Object!
    // should compare pointer of prev state (assume immutable)
    if (this.stateDiff(state)) {
      console.log('compute on stateDiff', this.styles);
      for (let key of this.typeMap.state) {
        let styleFun = this.styles[key]
        let style = styleFun(state);
        console.log('style', key, style)
        // check state/props dependency and only call if either one changed
        this.styleResult[key] = style
      }
    }

    if (this.propsDiff(props)) {
      console.log('compute on propsDiff');
      // should compare pointer of prev props (assume immutable)
      for (let key of this.typeMap.props) {
        let styleFun = this.styles[key]
        // check state/props dependency and only call if either one changed
        this.styleResult[key] = styleFun(props)
      }
    }
    console.log('styleResult', this.styleResult);
    return this.styleResult
  }
}

StyleBuilder.create = function(Styles) {
  StyleBuilder.prototype.styles = new Styles();
  return StyleBuilder;
}
