import { split } from './split-webstreams';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import {
  TextDecoderStream,
  ReadableStreamDefaultController,
  ReadableStream,
  WritableStream,
} from 'node:stream/web';
import * as path from 'path';
import * as split2 from 'split2';
import { TextEncoder } from 'util';

describe('splitWebstreams', () => {
  it('should only accept', async () => {
    let count = 0;
    class TestUnderlyingSource implements UnderlyingSource {
      #index = 10;
      start(controller: ReadableStreamDefaultController) {
        //
      }

      pull(controller: ReadableStreamDefaultController) {
        if (this.#index < 0) {
          controller.enqueue({ key: 11 });
        }
        controller.enqueue('\ndddddd  ' + this.#index);
        this.#index--;
      }
      cancel() {
        //
      }
    }
    const reader = new ReadableStream(new TestUnderlyingSource()).pipeThrough(
      split()
    );
    try {
      for await (const chunk of reader) {
        console.log(chunk);
        count++;
      }
    } catch (error) {
      expect(error).toEqual(
        'chunk must be string! pipeThrough TextDecoderStream first'
      );
    }
  });

  it('should work multiple line', async () => {
    //
    let count = 0;
    const reader = Readable.toWeb(
      createReadStream(path.join(__dirname, 'test-data.txt'))
    )
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(split());

    for await (const chunk of reader) {
      // console.log(chunk);
      count++;
    }
    expect(count).toEqual(20);
  });

  it('should work multiple line with utf16', async () => {
    //
    let count = 0;
    const reader = Readable.toWeb(
      createReadStream(path.join(__dirname, 'test-data-utf16.txt'))
    )
      .pipeThrough(new TextDecoderStream('utf-16'))
      .pipeThrough(split());

    for await (const chunk of reader) {
      // console.log(chunk);
      count++;
    }
    expect(count).toEqual(20);
  });

  it('should work only has one line', async () => {
    //
    let count = 0;
    const reader = Readable.toWeb(
      createReadStream(path.join(__dirname, 'test-data-oneline.txt'))
    )
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(split());

    for await (const chunk of reader) {
      // console.log(chunk);
      count++;
    }
    expect(count).toEqual(1);
  });

  it('should work only has one line', async () => {
    let count = 0;
    class TestUnderlyingSource implements UnderlyingSource {
      #index = 10;
      start(controller: ReadableStreamDefaultController) {
        //
      }

      pull(controller: ReadableStreamDefaultController) {
        if (this.#index < 0) {
          controller.close();
        }
        controller.enqueue('dddddd  ' + this.#index);
        this.#index--;
      }
      cancel() {
        //
      }
    }
    const reader = new ReadableStream(new TestUnderlyingSource()).pipeThrough(
      split()
    );

    for await (const chunk of reader) {
      count++;
    }
    expect(count).toEqual(1);
  });

  it('should work when Chinese char', async () => {
    let count = 0;
    class TestUnderlyingSource implements UnderlyingSource {
      dataBuffer = new TextEncoder().encode('a你的\n我的他的');
      #index = 0;
      start(controller: ReadableStreamDefaultController) {
        //
      }

      pull(controller: ReadableStreamDefaultController) {
        if (this.#index > this.dataBuffer.byteLength) {
          controller.close();
        }
        controller.enqueue(
          this.dataBuffer.slice(this.#index, (this.#index += 2))
        );
      }
      cancel() {
        //
      }
    }
    const reader = new ReadableStream(new TestUnderlyingSource())
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(split());

    for await (const chunk of reader) {
      count++;
    }
    expect(count).toEqual(2);
  });

  it('should work when split by char', async () => {
    let count = 0;
    class TestUnderlyingSource implements UnderlyingSource {
      dataBuffer = new TextEncoder().encode('a你的\n我的他的');
      #index = 0;
      start(controller: ReadableStreamDefaultController) {
        //
      }

      pull(controller: ReadableStreamDefaultController) {
        if (this.#index > this.dataBuffer.byteLength) {
          controller.close();
        }
        controller.enqueue(
          this.dataBuffer.slice(this.#index, (this.#index += 2))
        );
      }
      cancel() {
        //
      }
    }
    const reader = new ReadableStream(new TestUnderlyingSource())
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(split('的'));

    for await (const chunk of reader) {
      count++;
    }
    expect(count).toEqual(3);
  });

  it('should work line2', async () => {
    let count = 0;
    const reader = Readable.from(Buffer.from('\n')).pipe(split2());

    for await (const chunk of reader) {
      console.log(chunk);
      count++;
    }
    expect(count).toEqual(1);
  });
});
