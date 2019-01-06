/*prettier-ignore*/
"use strict";

var dotProp = require("@dot-store/dot-prop-immutable")

module.exports = function store(dot, options) {
  options = options || {}

  var state = options.state || {}

  if (dot.state.store) {
    return options
  }

  dot.state.store = state

  dot.onAny("before.get", get.bind(dot.state))
  dot.onAny("set", set.bind(dot.state))

  return dot
}

function get(o) {
  var prop = o.prop,
    sig = o.sig

  var props = dotProp.propToArray(prop).slice(1)

  if (prop) {
    sig.value = dotProp.get(this.store, props)
  } else {
    sig.value = this.store
  }
}

function set(o) {
  var opts = o.opts,
    prop = o.prop

  var props = dotProp.propToArray(prop).slice(1)

  this.store = dotProp.set(this.store, props, opts)
}
