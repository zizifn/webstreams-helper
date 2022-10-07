import { TransformStream } from './../platform/index';

export function split(matcher = /\r?\n/): TransformStream {
  return new TransformStream({
    transform(chunk, controller) {
      const chunks = chunk.split(matcher);
      chunks.forEach((value: any) => {
        controller.enqueue(value);
      });
    },
  });
}
