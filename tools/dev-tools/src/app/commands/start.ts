import startK8s from './start-k8s.js';
import startWatch from './start-watch.js';

export default async function start(): Promise<void> {
  await Promise.all([startK8s(), startWatch()]);
}
