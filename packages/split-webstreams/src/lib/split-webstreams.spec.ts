import { split } from './split-webstreams';
import { Readable, PassThrough } from 'stream';
import { createReadStream } from 'fs';
import { TextDecoderStream } from 'node:stream/web';

describe('splitWebstreams', () => {
  it('should work', async () => {
    //
    const reader = Readable.toWeb(createReadStream('./package.json')).pipeThrough(new TextDecoderStream()).pipeThrough(split()).getReader()
    for (let result = await reader.read(); !result.done; result = await reader.read()) {
      console.log('[value]', result.value);
    }
  });
});
