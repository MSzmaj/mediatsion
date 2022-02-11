import '../../../src/common/map.extensions';

test('add', () => {
    //Arrange
    const testMap: Map<string,number> = new Map();
    const returnValue = 1;
    const key = "key";
    const factory = () => returnValue;
    expect(testMap.get(key)).toBeUndefined();

    //Act
    //@ts-ignore
    const value = testMap.getOrAdd(key, factory);

    //Assert
    expect(value).toBe(returnValue);
    expect(testMap.get(key)).toBe(returnValue);
});

test('get', () => {
    //Arrange
    const returnValue = 1;
    const key = "key";
    const factory = () => returnValue;
    const testMap: Map<string,number> = new Map([[key, returnValue]]);
    expect(testMap.get(key)).toBe(returnValue);

    //Act
    //@ts-ignore
    const value = testMap.getOrAdd(key, factory);

    //Assert
    expect(value).toBe(returnValue);
    expect(testMap.get(key)).toBe(returnValue);
});