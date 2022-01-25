import { createRequestHandlerToken, GenericClassDecorator, IRequestHandler, REQUEST_HANDLER_REGISTRATION_ERROR } from "..";

const requestHandlerTypeRegistry: Map<string,Type<IRequestHandler<any,any>>> = new Map();

const requestHandler = (requestType: string, resultType: string): GenericClassDecorator<Type<IRequestHandler<any,any>>> => {
    return (target: Type<IRequestHandler<any,any>>) => {
        const token = createRequestHandlerToken(requestType, resultType);
        if (requestHandlerTypeRegistry.has(token)) {
            throw Error(`${REQUEST_HANDLER_REGISTRATION_ERROR}: ${token} is already registered`);
        }
        
        requestHandlerTypeRegistry.set(token, target);
    }
}

export { requestHandler, requestHandlerTypeRegistry };