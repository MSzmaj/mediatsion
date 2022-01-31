import '../common/map.extensions';
import { Err, Ok, Result } from "ts-results";
import {    Activator, createEventHandlerToken, createRequestHandlerToken, 
            eventHandlerTypeRegistry, EVENT_HANDLER_CREATION_ERROR, IBus, IEvent, IEventHandler, IInput, 
            IRequest, IRequestHandler, IResult, requestHandlerTypeRegistry, REQUEST_HANDLER_CREATION_ERROR 
        } from "..";

/**
 * Mediator class that all controllers should use in order to call the appropriate request handler.
 * Due to the lack of types in JS, you must instantiate the request/result objects in order to determine 
 * the correct types. You can leave one of the request/results uninstantiated, but, this will result in 
 * an `undefined` token in the DI container (i.e. IRequestHandler<undefined,{SomeOtherClass}>).
 */
class Bus implements IBus {
    private _requestHandlerMap: Map<string, IRequestHandler<unknown,unknown>> = new Map();
    private _eventHandlerMap: Map<string, IEventHandler<unknown>> = new Map()

    async send<TRequest extends IInput, TResult extends IResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>> {
        if (request.request === undefined && request.result === undefined) {
            throw Error(`${EVENT_HANDLER_CREATION_ERROR}: One of request or result must have a type. Did you forget to instantiate an object?`);
        }

        try {
            const requestType = request.request?.constructor.name || 'void';
            const resultType = request.result?.constructor.name || 'void';
            const token = createRequestHandlerToken(requestType, resultType);
            const handlerClass = requestHandlerTypeRegistry.get(token);

            if (handlerClass === undefined) {
                throw Error(`${REQUEST_HANDLER_CREATION_ERROR}: Handler not found for token: ${token}. Are you missing the \`requestHandler\` decorator?`);
            }

            //@ts-ignore
            const handler = this._requestHandlerMap.getOrAdd(token, () => Activator.resolve<IRequestHandler<TRequest, TResult>>(handlerClass));
            //@ts-ignore
            return await handler.handleAsync();
        } catch (error) {
            return Err(error as Error);
        }
    }

    async publish<TRequest extends IInput>(event: IEvent): Promise<Result<void[], Error>> {
        try {
            const requestType = event.constructor.name;
            const token = createEventHandlerToken(requestType);
            const handlerClasses = eventHandlerTypeRegistry.get(token);

            if (handlerClasses === undefined) {
                throw Error(`${REQUEST_HANDLER_CREATION_ERROR}: Handler(s) not found for token: ${token}. Are you missing the \`eventHandler\` decorator?`);
            }
            
            //TODO: cleanup?
            const results = await Promise.all(
                handlerClasses.map(
                    async (handlerClass) => {
                        const handler = this._eventHandlerMap.getOrAdd(`${handlerClass}`, () => Activator.resolve<IEventHandler<TRequest>>(handlerClass));
                        await handler.handleAsync(event);
                    }
                )
            );

            return Ok(results);
        } catch (error) {
            return Err(error as Error);
        }
    }
}

export { Bus };