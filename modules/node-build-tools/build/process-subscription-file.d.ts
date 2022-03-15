/// <reference types="voice" />
export default function addSubscriptionFileToQueue(eventName: chokidarEvents, path: absolutePath): void;
declare type chokidarEvents = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';
export declare function processSubscriptionFile(eventName: chokidarEvents, path: absolutePath): Promise<void>;
export {};
//# sourceMappingURL=process-subscription-file.d.ts.map