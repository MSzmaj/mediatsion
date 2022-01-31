export {};

declare global {
    interface Map<K,V> {
        getOrAdd(key: K, factory: (...args: unknown[]) => V): V;
    }
}