import { DatabaseError } from '../errors/DatabaseError';

export function DatabaseHandleErrors() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        throw new DatabaseError(error);
      }
    };

    return descriptor;
  };
}
