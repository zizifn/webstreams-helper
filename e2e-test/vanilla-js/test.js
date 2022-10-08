
class TimestampSource {
    #index = 10;
    start(controller) {
        controller.enqueue('start');
    }
    pull(controller) {
        for (; this.#index;) {
            controller.enqueue(this.#index);
            this.#index--;
        }
    }
    cancel() {
        //
    }
}

function ms(time) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, time)
    })
}

const stream = new ReadableStream(new TimestampSource());

const reader = stream.pipeThrough(
    new TransformStream({
        async transform(chunk, controller) {
            await ms(500).then(() => {
                if (chunk === 5) {
                    controller.error('dddddd')
                }
                controller.enqueue(chunk)
            })
        }
    }
    )).pipeTo(
        new WritableStream({
            write(chunk, controller) {
                /* … */
                console.log(chunk);
            },
        })
    )
    .catch((error) => {
        console.log(error);
    })
