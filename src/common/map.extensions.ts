Map.prototype.getOrAdd = function<K,V> (key: K, factory: (...args: unknown[]) => V): V {
    if (this.has(key)) {
        return this.get(key);
    }

    const value = factory();
    this.set(key, value);
    return value;
}

