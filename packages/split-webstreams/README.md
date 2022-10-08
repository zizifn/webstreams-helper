# split-webstreams

**THIS IS NOT DONE YET**

[split2](https://github.com/mcollina/split2#readme) for web streams api. Working for node and browser.

streams sepc:
https://streams.spec.whatwg.org/

MDN doc:
https://developer.mozilla.org/en-US/docs/Web/API/Streams_API

## Install

### npm

```bash
$ npm i split-webstreams
```

### jsdelivr

### ESM

```html
<script type="module">
  import { split } from 'https://cdn.jsdelivr.net/npm/split-webstreams@latest';
  console.log(split());
</script>
```

### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/split-webstreams@latest/dist/split-webstreams.umd.js"></script>
<script>
  console.log(window['split-webstreams'].split());
</script>
```

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
