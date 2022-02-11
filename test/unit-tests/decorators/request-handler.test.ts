import { Result } from 'ts-results';
import { createRequestHandlerToken, IRequest, IRequestHandler, requestHandler, requestHandlerTypeRegistry } from '../../../src';

class TestRequestHandler implements IRequestHandler<string, string> {
    handleAsync(request?: IRequest<string, string>): Promise<Result<string, Error>> {
        throw new Error('Method not implemented.');
    }
}

test('request handler should be registered', () => {
    //Arrange
    const requestType = 'Request';
    const resultType = 'Result';
    const decoratorFactory = requestHandler(requestType, resultType);
    const expectedHandler = TestRequestHandler;
    const token = createRequestHandlerToken(requestType, resultType);

    //Act
    decoratorFactory(TestRequestHandler);

    //Assert
    const returnHandler = requestHandlerTypeRegistry.get(token);
    expect(returnHandler).toBe(expectedHandler);
});