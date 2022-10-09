
class TimestampSource {
    #index = 10;
    #index2 = 3;
    start(controller) {
        // controller.enqueue('oooooooo');
        controller.enqueue(new TextEncoder().encode('start'));
    }
    pull(controller) {
        // if (this.#index < 0) {
        //     controller.close()
        // }
        // console.log('in pulling ');
        // controller.enqueue(new TextEncoder().encode(this.#index + 'ddddddddddddddddddddddd'));
        // this.#index--;

        if (this.#index2 < 0) {
            controller.close()
        }

        for (; this.#index;) {
            console.log('in pulling ');
            controller.enqueue(new TextEncoder().encode(this.#index + 'ddddddddddddddddddddddd'));
            this.#index--;
        }
        controller.enqueue(new TextEncoder().encode(this.#index2 + ' 2222222222'));
        console.log('in pulling 2222');
        this.#index2--;

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
const queuingStrategy = new ByteLengthQueuingStrategy({
    highWaterMark: 1,
});
const stream = new ReadableStream(new TimestampSource());


const queueingStrategy2 = new CountQueuingStrategy({ highWaterMark: 4 });
const reader = stream.pipeThrough(() => {
    throw 'dddl'
}).pipeThrough(
    new TransformStream({
        async transform(chunk, controller) {
            console.log('in TransformStream');
            controller.enqueue(chunk)
            // await ms(500).then(() => {
            //     if (chunk === 5) {
            //         controller.error('dddddd')
            //     }
            //     console.log('ddd', controller.desiredSize);
            //     controller.enqueue(chunk)
            // })
        }
    }, queueingStrategy2
    )).pipeTo(
        new WritableStream({
            async write(chunk, controller) {
                /* … */
                await ms(500).then(() => {
                    console.log(chunk);
                })
            },
        }, queuingStrategy)
    )
    .catch((error) => {
        console.log(error);
    })


function delay(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res('');
        }, ms);
    });
}
async function* testGen() {

    yield delay(1000).then(() => {
        console.log('inside a');
        return 'a'
    });
    console.log('after a');

    yield delay(1000).then(() => {
        console.log('inside b');
        return 'b'
    });
    console.log('after b');


    yield delay(1000).then(() => {
        console.log('inside c');
        return 'c'
    });
    console.log('after c');
    // return 'ddd';

}
const generator = testGen();
const value = generator.next();
console.log('main', value);
const value2 = generator.next();
console.log('main', value2);
