import { split } from './split-webstreams';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import {
  TextDecoderStream,
  ReadableStreamDefaultController,
  ReadableStream,
} from 'node:stream/web';
import * as path from 'path';
import * as split2 from 'split2';

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

  it('should work line2', async () => {
    class TimestampSource implements UnderlyingSource {
      #interval!: NodeJS.Timer;

      start(controller: ReadableStreamDefaultController) {
        this.#interval = setInterval(() => {
          const string = new Date().toLocaleTimeString();
          // Add the string to the stream.
          controller.enqueue(string);
          console.log(`Enqueued ${string}`);
        }, 1_000);

        setTimeout(() => {
          clearInterval(this.#interval);
          // Close the stream after 10s.
          controller.close();
        }, 10_000);
      }

      cancel() {
        // This is called if the reader cancels.
        clearInterval(this.#interval);
      }
    }

    const stream = new ReadableStream(new TimestampSource());

    //
    const nodeRS = Readable.fromWeb(stream).pipe(split2());

    for await (const chunk of nodeRS) {
      console.log('ddddddddd', chunk);
    }
  }, 12_000);
});
