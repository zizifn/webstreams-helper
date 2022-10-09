# A set of helper packages for web streams

<div align="center">

[split-webstreams ![npm version](https://img.shields.io/npm/v/split-webstreams.svg?style=flat-square)](https://www.npmjs.com/package/split-webstreams)
[webstreams-converter ![npm version](https://img.shields.io/npm/v/webstreams-converter.svg?style=flat-square)](https://www.npmjs.com/package/webstreams-converter)

</div>

**Support both node ( > 18) and browser**

[web streams sepc](https://streams.spec.whatwg.org/)

[MDN streams doc](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)

## split-webstreams [![npm version](https://img.shields.io/npm/v/split-webstreams.svg?style=flat-square)](https://www.npmjs.com/package/split-webstreams)

```bash
$ npm i split-webstreams
```

### Usage

This package has one function for [web streams](https://streams.spec.whatwg.org/).

- `split` is same as [String/split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split). But not support `limit` parameter.

More details is in [split-webstreams](./packages/split-webstreams/README.md)

## webstreams-converter [![npm version](https://img.shields.io/npm/v/webstreams-converter.svg?style=flat-square)](https://www.npmjs.com/package/webstreams-converter)

```bash
$ npm i webstreams-converter
```

### Usage

This package has two functions for [web streams](https://streams.spec.whatwg.org/).

- `webStreamsFrom(iterable)` is [stream.Readable.from](https://nodejs.org/api/stream.html#streamreadablefromiterable-options) implementation for web streams.

- `webStreams2AsyncIterator(readableStream)` is [Async Iteration](https://nodejs.org/api/webstreams.html#async-iteration) implementation for web streams in browser. `web streams` spec has this, but **no browser**implementation this yet.

More details is in [webstreams-converter](./packages/webstreams-converter/README.md)

## publish

npx nx run split-webstreams:publish --ver 0.0.2 --tag next
