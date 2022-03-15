export default function getTwoDotExtension(srcFile: fileNameOrPath): string {
  const slashSplit = srcFile.split('/');
  const dotSplit = slashSplit.slice(-1)[0]!.split('.');

  if (dotSplit.length < 2) return '';

  const lastTwo = dotSplit.slice(-2).join('.').toLowerCase();
  const lastOne = dotSplit.at(-1)!.toLowerCase();

  switch (lastTwo) {
    // all valid double-dot extensions
    case 'd.ts':
      return lastTwo;
  }

  return lastOne;
}
