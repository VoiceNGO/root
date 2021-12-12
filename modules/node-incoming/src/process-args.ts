// --command
// --command=foo
// --command foo
// -a
// -abc
// -abc
// -a=foo
// -a foo

function parseSingleArg(arg, argNext) {
  const splitCommand = /^(--?)?([a-z]+)(?:(=)(.+))?$/.exec(arg);
}

export default function processArgs(args: string[]) {}
