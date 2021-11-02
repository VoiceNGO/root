# Incoming-args

A utility for parsing input to a function via various paths:

- Shell arguments
- Direct calls (via `program.call`)
- Sock file (for having a single "master" instance that you can call repeatedly
  via the methods above)

## Usage

```js
var Program = require( 'node-incoming' );

var app = new Program()
  .version    ('0.0.1')
  .sock       ('/tmp/my-app.sock')
  .option     ('-a --Apple', 'Apples are round, kinda', handler, 'default')
  .addHelp    ('Description of the module goes here') // + generated help text
  .rest       ('fileNames') // name of your "rest" params
  .helpText   ('Help file goes here') // replaces generated help text
  .example    ('node foo.js --foo --bar --baz')
  .processArgs() // deferred call to process command-line arguments
  ;

app.on('call', function(data){
  // process data
});

app.on('exit', function(){
  // clean up before exit
});
```
