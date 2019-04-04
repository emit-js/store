/* eslint-env jest */

var emit,
  store = require("./store")

beforeEach(function() {
  emit = require("@emit-js/emit")()
  store(emit)
})

test("get", function() {
  emit.state.store = { a: { b: true } }
  expect(emit("get", "a", "b")).toBe(true)
  expect(emit.get("a", "b")).toBe(true)
})

test("delete", function() {
  return emit
    .set("a", "b", "c", true)
    .then(function() {
      return emit.delete("a", "b")
    })
    .then(function() {
      expect(emit.state.store).toEqual({ a: {} })
    })
})

test("merge", function() {
  return emit("merge", "a", { b: { c: true } }).then(
    function() {
      expect(emit("get", "a", "b", "c")).toBe(true)
    }
  )
})

test("queued set", function() {
  emit.state.store = { a: { b: { c: "hello" } } }
  return emit
    .set("a", "b", "c", function(value) {
      return value + " world"
    })
    .then(function() {
      expect(emit.get("a", "b", "c")).toBe("hello world")
    })
})

test("set", function() {
  return emit.set("a", "b", "c", true).then(function() {
    expect(emit.get("a", "b", "c")).toBe(true)
  })
})

test("set string", function() {
  return emit.set("a", "b", "c").then(function() {
    expect(emit.get("a", "b")).toBe("c")
  })
})

test("store", function() {
  expect.assertions(1)

  emit.on("store", "a", "b", "c", function() {
    var args = Array.prototype.slice.call(arguments)
    expect(args).toEqual([
      true,
      ["a", "b", "c"],
      emit,
      { event: "store" },
    ])
  })

  return emit.set("a", "b", "c", true)
})
