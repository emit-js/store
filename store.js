/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable"),
  empty = "",
  period = ".",
  queue = Promise.resolve()

module.exports = function store(dot, opts) {
  opts = opts || {}

  if (dot.state.store) {
    return dot
  }

  dot.state.store = opts.state || {}

  var boundSet = set.bind(dot.state)

  dot.onAny("before.get", get.bind(dot.state))
  dot.onAny("delete", boundSet)
  dot.onAny("merge", boundSet)
  dot.onAny("set", boundSet)

  return dot
}

function get(o) {
  var opts = o.opts,
    prop = o.prop,
    sig = o.sig

  prop = opts ? prop + (prop ? period : empty) + opts : prop

  if (prop) {
    sig.value = dotProp.get(this.store, prop) || null
  } else {
    sig.value = this.store
  }
}

function set(o) {
  var fn = o.fn,
    s = this

  if (fn) {
    queue = queue.then(function() {
      var v = fn(o)
      return setter.call({ o: o, s: s, v: v })
    })
  } else {
    var v = o.opts
    queue = queue.then(setter.bind({ o: o, s: s, v: v }))
  }

  return queue
}

function setter() {
  var dot = this.o.dot,
    ns = this.o.ns,
    prop = this.o.prop,
    props = this.o.props,
    s = this.s,
    v = this.v

  if (ns === "delete") {
    s.store = dotProp.delete(s.store, props)
  }

  if (ns === "merge") {
    s.store = dotProp.merge(s.store, props, v)
  }

  if (ns === "set") {
    s.store = dotProp.set(s.store, props, v)
  }

  return dot("store", prop, dot("get", prop)).then(this.o)
}
