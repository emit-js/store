/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable")

module.exports = function store(emit, state) {
  if (emit.get) {
    return
  }

  emit.state.store = state || {}
  emit.state.storePromise = Promise.resolve()

  emit("logLevel", "get", { info: "debug" })
  emit("logLevel", "set", { forceArg: true })
  emit("logLevel", "store", { info: "debug" })

  var boundGet = get.bind(emit.state),
    boundSet = set.bind(emit.state)

  emit.any("get", boundGet)
  emit.any("delete", boundSet)
  emit.any("merge", boundSet)
  emit.any("set", boundSet)
}

function get(arg, prop) {
  return getter.call({ p: prop, s: this })
}

function getter() {
  var p = this.p,
    s = this.s

  if (p) {
    return dotProp.get(s.store, p) || null
  } else {
    return s.store
  }
}

function set(arg, prop, emit, signal) {
  var id = signal.event,
    s = this

  if (typeof arg === "function") {
    this.storePromise = this.storePromise.then(function() {
      return setter.call({
        e: emit,
        i: id,
        p: prop,
        s: s,
        v: arg(getter.call({ p: prop, s: s })),
      })
    })
  } else {
    this.storePromise = this.storePromise.then(
      setter.bind({
        e: emit,
        i: id,
        p: prop,
        s: s,
        v: arg,
      })
    )
  }

  return this.storePromise
}

function setter() {
  var e = this.e,
    i = this.i,
    p = this.p,
    s = this.s,
    v = this.v

  if (i === "delete") {
    s.store = dotProp.delete(s.store, p)
  }

  if (i === "merge") {
    s.store = dotProp.merge(s.store, p, v)
  }

  if (i === "set") {
    if (typeof v === "undefined") {
      v = p.pop()
    }
    s.store = dotProp.set(s.store, p, v)
  }

  return e("store", p, v).then(function() {
    return v
  })
}
