require("../../../src/common/map.extensions");

test('add', () => {
    const testMap: Map<string,number> = new Map();
    const returnValue = 1;
    const key = "key";
    const factory = () => returnValue;

    expect(testMap.get(key)).toBeUndefined();
    const value = testMap.getOrAdd(key, factory);
    expect(value).toBe(returnValue);
    expect(testMap.get(key)).toBe(returnValue);
});

test('get', () => {
    const returnValue = 1;
    const key = "key";
    const factory = () => returnValue;
    const testMap: Map<string,number> = new Map([[key, returnValue]]);

    expect(testMap.get(key)).toBe(returnValue);
    const value = testMap.getOrAdd(key, factory);
    expect(value).toBe(returnValue);
    expect(testMap.get(key)).toBe(returnValue);
});