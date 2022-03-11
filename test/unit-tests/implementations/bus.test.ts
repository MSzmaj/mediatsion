import { Ok, Result } from "ts-results";
import { Bus, eventHandler, IEvent, IEventHandler, IRequest, IRequestHandler, requestHandler } from "../../../src";

class TestRequest implements IRequest<string,string> {
    request: string;
    result: string;
}

class TestRequestHandler implements IRequestHandler<string,string> {
    async handleAsync(request?: IRequest<string, string>): Promise<Result<string, Error>> {
        return Ok("");
    }

}

class TestEvent implements IEvent {}

const eventHistory: Array<[event: IEvent, handler: string]> = [];

class TestEventHandler1 implements IEventHandler<TestEvent> {
    async handleAsync(event: IEvent): Promise<void> {
        eventHistory.push([event, typeof(TestEventHandler1)]);
    }
}

class TestEventHandler2 implements IEventHandler<TestEvent> {
    async handleAsync(event: IEvent): Promise<void> {
        eventHistory.push([event, typeof(TestEventHandler2)]);
    }
}

test('bus should send command', async () => {
    //Arrange
    const bus = new Bus();
    const command = new TestRequest();
    command.request = command.result = "string";
    const decoratorFactory = requestHandler('String','String');
    decoratorFactory(TestRequestHandler);

    //Act
    const result = await bus.send(command);

    //Assert
    expect(result.ok).toBe(true);
});

test('bus should publish events; default strategy', async () => {
    //Arrange
    const bus = new Bus();
    const event = new TestEvent();
    const decoratorFactory1 = eventHandler('TestEvent');
    decoratorFactory1(TestEventHandler1);
    const decoratorFactory2 = eventHandler('TestEvent');
    decoratorFactory2(TestEventHandler2);

    //Act
    const result = await bus.publish(event);

    //Assert
    expect(result.ok).toBe(true);
    expect(eventHistory).toContainEqual([event, typeof(TestEventHandler1)]);
    expect(eventHistory).toContainEqual([event, typeof(TestEventHandler2)]);
    expect(eventHistory[0]).toEqual([event, typeof(TestEventHandler1)]);
    expect(eventHistory[1]).toEqual([event, typeof(TestEventHandler2)]);
});

test('bus should publish events; custom strategy', async () => {
    //Arrange
    const bus = new Bus();
    const event = new TestEvent();
    const decoratorFactory1 = eventHandler('TestEvent');
    decoratorFactory1(TestEventHandler1);
    const decoratorFactory2 = eventHandler('TestEvent');
    decoratorFactory2(TestEventHandler2);
    const strategy = async (handlers: Array<IEventHandler<TestEvent>>, event: IEvent): Promise<Array<void>> => {
        const result: Array<void> = [];
        for (let i = handlers.length-1; i >= 0; i--) {
            result.push(await handlers[i].handleAsync(event));
        }
        return result;
    }

    //Act
    const result = await bus.publish(event, strategy);

    //Assert
    expect(result.ok).toBe(true);
    expect(eventHistory).toContainEqual([event, typeof(TestEventHandler1)]);
    expect(eventHistory).toContainEqual([event, typeof(TestEventHandler2)]);
    expect(eventHistory[0]).toEqual([event, typeof(TestEventHandler2)]);
    expect(eventHistory[1]).toEqual([event, typeof(TestEventHandler1)]);
});