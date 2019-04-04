# @emit-js/store

[emit](https://github.com/emit-js/emit#readme) immutable store

![that's us](store.png)

## Install

```bash
npm install @emit-js/emit @emit-js/store
```

## Setup

```js
const emit = require("@emit-js/emit")()
require("@emit-js/store")(emit)
```

## Usage

```js
emit.set("prop", "prop2", "some value")
emit.get("prop", "prop2") // "some value"
```

```js
emit.merge("prop", { prop3: "another value" })
emit.get("prop") // { prop2: "some value", prop3: "another value" }
```

```js
emit.delete("prop")
emit.get() // {}
```

## Listen to store changes

Use [`emit.on`](https://github.com/emit-js/emit#basics) or [`emit.any`](https://github.com/emit-js/emit#any) on the `store` [event id](https://github.com/emit-js/emit#event-id):

```js
emit.on("store", "prop", () => {})
```

## Queued update

Pass a function to `emit.set` for atomic operations:

```js
emit.set("counter", value => (value || 0) + 1)
```

## Raw state

The raw state object is available at `emit.state.store`.

## Credit

Some of the immutability features were borrowed from [debitoor/dot-prop-immutable](https://github.com/debitoor/emit-prop-immutable).
