# split-webstreams

Break up a stream and reassemble it so that each line is a chunk. `split-webstreams` is inspired by [split2](https://github.com/mcollina/split2).

However this is for [web streams](https://streams.spec.whatwg.org/) which is support by Node and browser.

**And package working in node and browser.**

streams sepc:
https://streams.spec.whatwg.org/

MDN doc:
https://developer.mozilla.org/en-US/docs/Web/API/Streams_API

## API

`split` is same as [String/split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split). But not support `limit ` parameter.

```javascript
import { split } from 'split-webstreams';
const reader = Readable.toWeb(
  createReadStream(path.join(__dirname, 'test-data.txt'))
)
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(split());

for await (const chunk of reader) {
  console.log(chunk);
}
```

## Install

### npm

```bash
$ npm i split-webstreams
```

### jsdelivr

#### ESM

```html
<script type="module">
  import { split } from 'https://cdn.jsdelivr.net/npm/split-webstreams@latest';
  console.log(split());
</script>
```

[esm-example-html](../../e2e-test/vanilla-js/index-esm.html)

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/split-webstreams@latest/dist/split-webstreams.umd.js"></script>
<script>
  console.log(window['split-webstreams'].split());
</script>
```

[umd-example-html](../../e2e-test/vanilla-js/index-umd.html)

## Usage

```javascript
(async () => {
  await fetch(`https://rickandmortyapi.com/api/character/23`)
    .then((res) => res.body)
    .then(async (body) => {
      const reader = body
        ?.pipeThrough(new TextDecoderStream())
        .pipeThrough(split())
        .getReader();
      for (
        let result = await reader?.read();
        !result?.done;
        result = await reader?.read()
      ) {
        console.log('[value]', result?.value);
      }
      // …
    });
})();
```
