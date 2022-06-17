import isServiceDefinition from '../build-utils/is-service-definition';
import * as serviceBuilder from './ts-service-build';
import * as tsBuilder from './ts-normal-build';

import TSTypes from '../enums/ts-types';

async function getTSType(srcPath: absoluteFilePath): Promise<TSTypes> {
  const isService = await isServiceDefinition(srcPath);

  if (isService) {
    return TSTypes.SERVICE_DEFINITION;
  }

  return TSTypes.NORMAL;
}

async function getBuilder(srcPath: absoluteFilePath) {
  const tsType = await getTSType(srcPath);
  return {
    [TSTypes.NORMAL]: tsBuilder,
    [TSTypes.SERVICE_DEFINITION]: serviceBuilder,
  }[tsType];
}

export async function buildFile(
  srcPath: absoluteFilePath
): Promise<Record<absoluteFilePath, Buffer | string>> {
  const builder = await getBuilder(srcPath);

  return builder.buildFile(srcPath);
}

export async function getBuildFiles(
  srcPath: absoluteFilePath
): Promise<absoluteFilePath[]> {
  const builder = await getBuilder(srcPath);

  return builder.getBuildFiles(srcPath);
}
