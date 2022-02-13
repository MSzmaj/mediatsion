import { createEventHandlerToken, createRequestHandlerToken } from "../../../src";

test('should create request handler token', () => {
    //Arrange
    const expectedToken = 'IRequestHandler<RequestType,ResultType>';
    const requestType = 'RequestType';
    const resultType = 'ResultType';

    //Act
    const returnToken = createRequestHandlerToken(requestType, resultType);

    //Assert
    expect(returnToken).toBe(expectedToken);
});

test('should create event handler token', () => {
    //Arrange
    const expectedToken = 'EventType';
    const eventType = 'EventType';

    //Act
    const returnToken = createEventHandlerToken(eventType);

    //Assert
    expect(returnToken).toBe(expectedToken);
});