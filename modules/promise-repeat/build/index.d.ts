export default function retryPromise<PromiseResult, Args>(
  fn: (...args: Args[]) => Promise<PromiseResult>,
  options?: {
    maxAttempts?: number;
    timeoutMs?: number;
    throttleMs?: number;
    throttleFn?: (retryCount: number, throttleMs: number) => number;
    shouldRetryFn?: (err: unknown, retryCount: number) => boolean;
    resolveAfterReject?: (result: PromiseResult) => void;
  }
): (...args: Args[]) => Promise<PromiseResult>;
