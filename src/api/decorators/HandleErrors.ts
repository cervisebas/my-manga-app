import { ApiError } from '../errors/ApiError';

export function HandleErrors() {
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
        throw new ApiError(error);
      }
    };

    return descriptor;
  };
}
