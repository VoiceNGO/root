import stopK8s from './stop-k8s.js';
import stopWatch from './stop-watch.js';

export default async function stop(): Promise<void> {
  await Promise.all([stopK8s(), stopWatch()]);
}
