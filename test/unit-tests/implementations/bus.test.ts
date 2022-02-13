import { Ok, Result } from "ts-results";
import { Bus, IRequest, IRequestHandler, requestHandler } from "../../../src";

class TestRequest implements IRequest<string,string> {
    request: string;
    result: string;
}

class TestRequestHandler implements IRequestHandler<string,string> {
    async handleAsync(request?: IRequest<string, string>): Promise<Result<string, Error>> {
        return Ok("");
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