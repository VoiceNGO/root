/* eslint func-name-matching: "off", @typescript-eslint/ban-types: "off", no-console: "off" */

const instances = new WeakMap();
let counter = 0;

function addToMap(instance: Object) {
  const inst = { enabled: true, index: counter++ };

  instances.set(instance, inst);

  return inst;
}

function getIndex(instance: Object) {
  return (instances.get(instance) || addToMap(instance)).index;
}

function toggle(instance: Object, enabled: boolean) {
  (instances.get(instance) || addToMap(instance)).enabled = enabled;
}

function isEnabled(instance: Object) {
  return instances.has(instance)
    ? instances.get(instance).enabled
    : addToMap(instance).enabled;
}

function isPromise(obj: Promise<unknown>) {
  return Boolean(
    obj &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
  );
}

export default function timerDecorator(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const fn = descriptor.value;
  const key = fn.name;

  descriptor.value = function timerDecoratorDescriptor(...args: unknown[]) {
    if (isEnabled(this)) {
      const instanceNum = getIndex(this);
      const timingName = `${this.constructor.name}#${instanceNum}.${key}`;
      let retVal = null;

      console.time(timingName);
      retVal = fn.call(this, ...args);

      if (isPromise(retVal)) {
        retVal.then(console.timeEnd.bind(console, timingName));
      } else {
        console.timeEnd(timingName);
      }

      return retVal;
    }

    return fn.call(this, ...args);
  };

  return descriptor;
}

export function enable(instance: Object): void {
  toggle(instance, true);
}

export function disable(instance: Object): void {
  toggle(instance, false);
}

export function release(instance: Object): void {
  instances.delete(instance);
}
