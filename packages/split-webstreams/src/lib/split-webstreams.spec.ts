import { split } from './split-webstreams';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { TextDecoderStream } from 'node:stream/web';
import * as path from 'path';

describe('splitWebstreams', () => {
  it('should work', async () => {
    //
    const reader = Readable.toWeb(
      createReadStream(path.join(__dirname, 'test-data.txt'))
    )
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(split())
      .getReader();
    let final = '';
    for (
      let result = await reader.read();
      !result.done;
      result = await reader.read()
    ) {
      final += result.value + '\n';
    }
    console.log(final);
  });
});
