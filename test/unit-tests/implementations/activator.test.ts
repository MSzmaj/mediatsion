import { Activator } from "../../../src";

class InjectableObject {}
class ActivateableObject {
    testProperty: InjectableObject

    constructor (testProperty: InjectableObject) {
        this.testProperty = testProperty;
    }
}

test('object should be activated', () => {
    //Arrange
    //@ts-ignore
    Reflect.defineMetadata('design:paramtypes', [InjectableObject], ActivateableObject);
    const expectedObject = new ActivateableObject(new InjectableObject())

    //Act
    const activateable = Activator.resolve<ActivateableObject>(ActivateableObject);

    //Assert
    expect(activateable).toMatchObject(expectedObject);
});