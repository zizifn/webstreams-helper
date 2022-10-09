import { ReadableStream } from './../platform/index';

export function webStreamsFrom<T>(
  iterable: Iterable<T> | AsyncIterable<T>
): ReadableStream {
  let iterator: AsyncIterator<T> | Iterator<T> | undefined = undefined;
  if (
    Reflect.has(Object(iterable), Symbol.iterator) ||
    Reflect.has(Object(iterable), Symbol.asyncIterator)
  ) {
    iterator =
      (iterable as Iterable<T>)[Symbol.iterator]?.() ||
      (iterable as AsyncIterable<T>)[Symbol.asyncIterator]?.();
  }

  return new ReadableStream<T | Iterable<T> | AsyncIterable<T>>({
    start(controller) {
      if (!iterator) {
        controller.error('need pass Iterable object');
        return;
      }
      // will not have the strings or buffers be iterated to match the other streams semantics for performance reasons.
      if (typeof iterable === 'string' || ArrayBuffer.isView(iterable)) {
        controller.enqueue(iterable);
        controller.close();
        return;
      }
    },
    async pull(controller) {
      if (!iterator) {
        controller.error('need pass Iterable object');
        return;
      }
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export function webStreams2AsyncIterator<T>(
  stream: ReadableStream<T>
): AsyncIterable<T> {
  const reader = stream.getReader();

  async function* internal() {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        return;
      }
      yield value;
    }
  }
  return internal();
}
