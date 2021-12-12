# Incoming-args

A utility for parsing input to a function via various paths:

- Shell arguments
- Direct calls (via `program.call`)
- Sock file (for having a single "master" instance that you can call repeatedly
  via the methods above)

## Usage

```js
const Program = require('node-incoming');

const app = new Program({
  name: 'do-thing',
  version: '0.0.1',
  sock: '/tmp/my-app.sock',
  description: 'Description of the module goes here',
  example: 'node foo.js --foo --bar --baz',
  commands: [
    new Program({
      name: 'make-smoothie',
      options: {
        fruit: {
          short: 'f',
          choices: ['apple', 'strawberry', 'banana'],
          required: true,
          variadic: true,
        },
      },
    }),
  ],
});

app.on('call', function (data) {
  // process data
});

app.on('exit', function () {
  // clean up before exit
});

app.parseArgv();
```
