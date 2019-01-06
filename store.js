/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("@dot-store/dot-prop-immutable")
var queue = Promise.resolve()

module.exports = function store(dot, opts) {
  opts = opts || {}

  if (dot.state.store) {
    return dot
  }

  dot.state.store = opts.state || {}

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
  var fn = o.fn,
    opts = o.opts,
    prop = o.prop

  if (fn) {
    queue = queue.then(fn)
  } else {
    queue = queue.then(
      setQueue.bind({ opts: opts, prop: prop, state: this })
    )
  }

  return queue.then(function() {
    return o
  })
}

function setQueue() {
  var opts = this.opts,
    prop = this.prop,
    state = this.state

  var props = dotProp.propToArray(prop).slice(1)

  state.store = dotProp.set(state.store, props, opts)
}
