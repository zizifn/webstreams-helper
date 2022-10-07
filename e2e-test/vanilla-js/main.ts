import { split } from 'split-webstreams';
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

        document.getElementById('app')!.textContent = result?.value;
      }
      // …
    });
})();
