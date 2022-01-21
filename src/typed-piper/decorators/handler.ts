import { createRequestHandlerToken, GenericClassDecorator, IRequestHandler } from "..";

const tokenHandlerRegistry: Map<string,Type<IRequestHandler<any,any>>> = new Map();

const handler = (requestType: string, resultType: string): GenericClassDecorator<Type<IRequestHandler<any,any>>> => {
    return (target: Type<IRequestHandler<any,any>>) => {
        const token = createRequestHandlerToken(requestType, resultType);
        if (tokenHandlerRegistry.has(token)) {
            throw Error(`${token} is already registered`);
        }
        
        tokenHandlerRegistry.set(token, target);
    }
}

export { handler, tokenHandlerRegistry };