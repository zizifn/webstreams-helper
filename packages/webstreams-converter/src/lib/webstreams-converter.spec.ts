import {
  webStreamsFrom,
  webStreams2AsyncIterator,
} from './webstreams-converter';

describe('webstreamsConverter', () => {
  it('should work for strings', async () => {
    let result = '';
    const read = webStreamsFrom('test string');
    for await (const value of read) {
      result += value;
    }
    expect(result).toEqual('test string');
  });

  it('should work for array', async () => {
    let result = '';
    const read = webStreamsFrom<string>(['a', 'b', 'c']);

    for await (const value of read) {
      result += value;
    }
    expect(result).toEqual('abc');
  });

  it('should work for generator', async () => {
    function* testGen() {
      yield 'a';
      yield 'b';
      yield 'c';
      return 'ddd';
    }

    let result = '';
    const read = webStreamsFrom(testGen());

    for await (const value of read) {
      result += value;
    }
    expect(result).toEqual('abc');
  });

  it('should work for async generator', async () => {
    function delay(ms: number) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res('');
        }, ms);
      });
    }
    async function* testGen() {
      yield delay(1000).then(() => 'a');
      yield delay(1000).then(() => 'b');
      yield delay(1000).then(() => 'c');
      return 'ddd';
    }

    let result = '';
    const read = webStreamsFrom(testGen());

    for await (const value of read) {
      result += value;
    }
    expect(result).toEqual('abc');
  });

  it('should work for async generator', async () => {
    const read = webStreamsFrom<string>(['a', 'b', 'c']);

    for await (const val of webStreams2AsyncIterator<string>(read)) {
      console.log(val);
    }
  });
});
