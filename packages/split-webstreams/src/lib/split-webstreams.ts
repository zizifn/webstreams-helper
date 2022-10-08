import { TransformStream } from './../platform/index';

export function split(
  matcher: string | RegExp = /\r?\n/
): TransformStream<string, string> {
  let last = '';
  return new TransformStream({
    transform(chunk: string, controller) {
      if (typeof chunk !== 'string') {
        controller.error(
          'chunk must be string! pipeThrough TextDecoderStream first'
        );
        return;
      }
      last += chunk;
      const lines = last.split(matcher);
      last = lines.pop() || '';
      lines.forEach((line) => {
        controller.enqueue(line);
      });
    },

    // enqueue last line
    flush(controller) {
      if (last !== '') {
        controller.enqueue(last);
      }
    },
  });
}
