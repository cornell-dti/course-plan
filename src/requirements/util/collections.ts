export class HashMap<K, V> {
  private readonly backingMap: Map<string, readonly [K, V]>;

  constructor(private readonly getUniqueHash: (key: K) => string) {
    this.backingMap = new Map();
  }

  clear(): void {
    this.backingMap.clear();
  }

  delete(key: K): boolean {
    return this.backingMap.delete(this.getUniqueHash(key));
  }

  set(key: K, value: V): this {
    this.backingMap.set(this.getUniqueHash(key), [key, value]);
    return this;
  }

  get(key: K): V | undefined {
    return this.backingMap.get(this.getUniqueHash(key))?.[1];
  }

  has(key: K): boolean {
    return this.backingMap.has(this.getUniqueHash(key));
  }

  get size(): number {
    return this.backingMap.size;
  }

  forEach(callbackFunction: (value: V, key: K) => void): void {
    this.backingMap.forEach(([key, value]) => callbackFunction(value, key));
  }

  keys(): readonly K[] {
    const keys: K[] = [];
    this.backingMap.forEach(keyValue => keys.push(keyValue[0]));
    return keys;
  }

  entries(): readonly (readonly [K, V])[] {
    const entries: (readonly [K, V])[] = [];
    this.backingMap.forEach(keyValue => entries.push(keyValue));
    return entries;
  }
}

export class HashSet<T> {
  private readonly backingMap: Map<string, T>;

  constructor(private readonly getUniqueHash: (value: T) => string) {
    this.backingMap = new Map();
  }

  add(value: T): this {
    this.backingMap.set(this.getUniqueHash(value), value);
    return this;
  }

  clear(): void {
    this.backingMap.clear();
  }

  delete(value: T): boolean {
    return this.backingMap.delete(this.getUniqueHash(value));
  }

  forEach(callbackFunction: (value: T) => void): void {
    this.backingMap.forEach(callbackFunction);
  }

  toArray(): T[] {
    const array: T[] = [];
    this.forEach(element => array.push(element));
    return array;
  }

  has(value: T): boolean {
    return this.backingMap.has(this.getUniqueHash(value));
  }

  get size(): number {
    return this.backingMap.size;
  }
}
