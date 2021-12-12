import serialize from 'serialize-javascript';

const instanceMap: WeakMap<PropertyDescriptor, number> = new WeakMap();
const methodMap: Map<string, unknown> = new Map();
let counter = 1;

export default function memoize<T extends unknown[] = []>(
  targetClass: Obj,
  methodName: string,
  descriptor: TypedPropertyDescriptor<(...args: T) => unknown>
): PropertyDescriptor {
  const fn = descriptor.value;
  const className = targetClass.constructor.name;
  const isFn = typeof fn === 'function';

  if (!isFn) {
    throw new Error(
      `Decorator expected a function, but called on a ${typeof fn}`
    );
  }

  descriptor.value = function value(...args: T): unknown {
    const instanceExists = instanceMap.has(this);
    const instanceNumber = instanceMap.get(this) || counter++;
    const serializedArgs = serialize(args).slice(1, -1); // .slice removes opening & closing []'s
    const methodKey = `${className}[${instanceNumber}].${methodName}(${serializedArgs})`;
    const methodExists = methodMap.has(methodKey);
    const returnValue = methodExists
      ? methodMap.get(methodKey)
      : fn.call(this, ...args);

    if (!instanceExists) {
      instanceMap.set(this, instanceNumber);
    }
    if (!methodExists) {
      methodMap.set(methodKey, returnValue);
    }

    return returnValue;
  };

  return descriptor;
}
