type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: Error) => void;
// type PromiseFn<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;
// type InitArgs<T> = [ResolveFn<T>, RejectFn];
// export class Deferrable<T> extends Promise<T> {
//   public resolve!: ResolveFn<T>;
//   public reject!: RejectFn;
//   public init: PromiseFn<T> = (resolve: ResolveFn<T>, reject: RejectFn) => {
//     this.resolve = resolve;
//     this.reject = reject;
//     // this.init = null;
//     return this;
//   };

//   constructor(callback: PromiseFn<T>) {
//     super(callback);
//   }

//   static async create<T>() {
//     let output!: Deferrable<T>;
//     const initArgs: InitArgs<T> = await new Promise<InitArgs<T>>((resolve) => {
//       output = new Deferrable<T>((res: ResolveFn<T>, rej: RejectFn) => {
//         resolve([res, rej] as InitArgs<T>);
//       });
//     });

//     return [output.init(...initArgs)];
//   }
// }

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
