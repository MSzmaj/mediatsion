import { Err, Result } from "ts-results";
import { createRequestHandlerToken, IBus, IInput, IRequest, IRequestHandler, IResult, tokenHandlerRegistry } from "..";
import { Activator } from "./activator";

/**
 * Mediator class that all controllers should use in order to call the appropriate request handler.
 * Due to the lack of types in JS, you must instantiate the request/result objects in order to determine 
 * the correct types. You can leave one of the request/results uninstantiated, but, this will result in 
 * an `undefined` token in the DI container (i.e. IRequestHandler<undefined,{SomeOtherClass}>).
 */
class Bus implements IBus {
    private _handlerMap: Map<string, Type<IRequestHandler<any,any>>> = new Map();

    public constructor () {
        this._handlerMap = tokenHandlerRegistry;
    }

    async send<TRequest extends IInput, TResult extends IResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>> {
        if (request.request === undefined && request.result === undefined) {
            return Err(new Error("One of request or result must have a type. Did you forget to instantiate an object?"));
        }

        try {
            const requestType = request.request?.constructor.name || 'void';
            const resultType = request.result?.constructor.name || 'void';
            const token = createRequestHandlerToken(requestType, resultType);
            const handlerClass = this._handlerMap.get(token);
            if (handlerClass === undefined) {
                throw Error();
            }
            const handler = Activator.resolve<IRequestHandler<TRequest, TResult>>(handlerClass);
            return await handler.handleAsync();
        } catch (error) {
            return Err(new Error("Handler not found"));
        }
    }

    async publish(event: Event): Promise<void> {
        throw new Error("Not implemented.");
    }
}

export { Bus };