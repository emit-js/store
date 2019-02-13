# @dot-event/store

[dot-event](https://github.com/dot-event/dot-event#readme) immutable store

![that's us](thatsus.png)

## Install

```bash
npm install dot-event @dot-event/store
```

## Setup

```js
const dot = require("dot-event")()
require("@dot-event/store")(dot)
```

## Usage

```js
dot.set("prop", "prop2", "some value")
dot.get("prop", "prop2") // "some value"
```

```js
dot.merge("prop", { prop3: "another value" })
dot.get("prop") // { prop2: "some value", prop3: "another value" }
```

```js
dot.delete("prop")
dot.get() // {}
```

## Listen to store changes

Use [`dot.on`](https://github.com/dot-event/dot-event#basics) or [`dot.any`](https://github.com/dot-event/dot-event#any) on the `store` [event id](https://github.com/dot-event/dot-event#event-id):

```js
dot.on("store", "prop", () => {})
```

## Queued update

Pass a function to `dot.set` for atomic operations:

```js
dot.set("counter", value => (value || 0) + 1)
```

## Raw state

The raw state object is available at `dot.state.store`.

## Credit

Some of the immutability features were borrowed from [debitoor/dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable).
