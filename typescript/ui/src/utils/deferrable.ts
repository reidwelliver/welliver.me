type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: Error) => void;

export interface Deferrable<T> extends Promise<T> {
  resolve: ResolveFn<T>;
  reject: RejectFn;
}

export function createDeferrable<T>(): Deferrable<T> {
  let res!: ResolveFn<T>;
  let rej!: RejectFn;

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  (promise as Deferrable<T>).resolve = res;
  (promise as Deferrable<T>).reject = rej;

  return promise as Deferrable<T>;
}
