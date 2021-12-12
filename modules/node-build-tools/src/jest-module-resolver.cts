// temporary workaround while we wait for https://github.com/facebook/jest/issues/9771
import { create, ResolveRequest, ResolveOptions } from 'enhanced-resolve';
import { writeFile } from 'fs';

const extensions = ['.js', '.jsx', '.json', '.node', '.ts', '.tsx'];
const importResolver = create.sync({
  conditionNames: ['import', 'node', 'default'],
  extensions,
});
const requireResolver = create.sync({
  conditionNames: ['require', 'node', 'default'],
  extensions,
});

export default function (request: ResolveRequest, options: ResolveOptions) {
  writeFile(
    '/voice/modules/node-build-tools/out.txt',
    JSON.stringify({ request, options }),
    () => {}
  );
  let resolver = requireResolver;
  if (options.conditions?.includes('import')) {
    resolver = importResolver;
  }

  return resolver(options.basedir, request);
}
