// implementation signature of ./Observable.js

export class Observable<T> {
  constructor(data: T);

  subscribe(callback: (data: T) => void): () => void;

  set(data: T | ((data: T) => T)): void;

  get value(): T;
}
