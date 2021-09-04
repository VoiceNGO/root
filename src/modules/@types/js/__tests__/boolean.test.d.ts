/* eslint-disable */
import { expectType } from 'tsd';

declare const boolean: boolean;
declare const multipleTruthyValues: true | {} | [] | Function;
declare const multipleFalsyValues: false | null | undefined;
declare const multipleMixedValues: true | false | null | {};

expectType<true>(Boolean(true));
expectType<true>(Boolean({}));
expectType<true>(Boolean(() => {}));
expectType<true>(Boolean([]));
expectType<true>(Boolean(multipleTruthyValues));

expectType<false>(Boolean(false));
expectType<false>(Boolean(null));
expectType<false>(Boolean(undefined));
expectType<false>(Boolean(multipleFalsyValues));

// Backwards tests because expectType<boolean>(true) passes whereas expectType<true>(boolean) fails
const stringResult = Boolean('');
expectType<typeof stringResult>(boolean);

const numberResult = Boolean(0);
expectType<typeof numberResult>(boolean);

const multipleMixedResults = Boolean(multipleMixedValues);
expectType<typeof multipleMixedResults>(boolean);
