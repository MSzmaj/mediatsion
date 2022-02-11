import { eventHandler, eventHandlerTypeRegistry, IEvent, IEventHandler } from '../../../src';

class TestEventHandler implements IEventHandler<string> {
    handleAsync(event: IEvent): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

test('event handler should be registered', () => {
    //Arrange
    const token = 'TestEventHandler';
    const decoratorFactory = eventHandler(token);
    const expectedHandlerArray = [TestEventHandler];

    //Act
    decoratorFactory(TestEventHandler);

    //Assert
    const returnHandlerArray = eventHandlerTypeRegistry.get(token);
    expect(returnHandlerArray).toMatchObject(expectedHandlerArray);
});