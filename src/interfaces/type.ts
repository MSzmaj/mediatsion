interface Type<T> {
    new(...args: unknown[]): T;
}

export { Type };