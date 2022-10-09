# webstreams-converter

`webStreamsFrom` is [stream.Readable.from](https://nodejs.org/api/stream.html#streamreadablefromiterable-options) implementation for web streams.

`webStreams2AsyncIterator` is [Async Iteration](https://nodejs.org/api/webstreams.html#async-iteration) implementation for web streams in browser. `web streams` spec has this, but no browser implementation this yet.

**Zero dependency! And package working in node and browser.**

streams sepc:
https://streams.spec.whatwg.org/

MDN doc:
https://developer.mozilla.org/en-US/docs/Web/API/Streams_API

## API

### webStreamsFrom(iterable)

Parameter `iterable` is any value meet [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)

> strings or [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) will only in one chunk.

```javascript
import { webStreamsFrom, webStreams2AsyncIterator } from 'webstreams-converter';

function* testGen() {
  yield 'a';
  yield 'b';
  yield 'c';
  return 'ddd';
}

let result = '';
const read = webStreamsFrom(testGen());
```

### webStreams2AsyncIterator(readableStream)

Parameter readableStream is instance of [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

> strings or [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) will only in one chunk.

```javascript
import { webStreamsFrom, webStreams2AsyncIterator } from 'webstreams-converter';

const read = webStreamsFrom(['a', 'b', 'c']);
for await (const val of webStreams2AsyncIterator(read)) {
  console.log(val);
}
```

## Install

### npm

```bash
$ npm i webstreams-converter
```

### jsdelivr

#### ESM

```html
<script type="module">
  import {
    webStreamsFrom,
    webStreams2AsyncIterator,
  } from 'https://cdn.jsdelivr.net/npm/webstreams-converter@latest';
  const read = webStreamsFrom(['a', 'b', 'c']);
  for await (const val of webStreams2AsyncIterator(read)) {
    console.log(val);
  }
</script>
```

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/webstreams-converter@latest/dist/webstreams-converter.umd.js"></script>
<script>
  const webStreamsFrom = window['webstreams-converter'].webStreamsFrom;
  const webStreams2AsyncIterator =
    window['webstreams-converter'].webStreams2AsyncIterator;

  const read = webStreamsFrom(['a', 'b', 'c']);
  (async () => {
    for await (const val of webStreams2AsyncIterator(read)) {
      console.log(val);
    }
  })();
</script>
```
