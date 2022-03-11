import '../common/map.extensions';
import { Err, Ok, Result } from "ts-results";
import {    Activator, createEventHandlerToken, createRequestHandlerToken, eventHandlerTypeRegistry, 
            REQUEST_HANDLER_CREATION_ERROR, HANDLER_CREATION_ERROR, EVENT_HANDLER_CREATION_ERROR,
            IBus, IEvent, IEventHandler, IInput, IRequest, IRequestHandler, IResult, requestHandlerTypeRegistry, 
        } from "..";

/**
 * Mediator class that all controllers should use in order to call the appropriate request handler.
 * Due to the lack of types in JS, you must instantiate the request/result objects in order to determine 
 * the correct types. You can leave one of the request/results uninstantiated, but, this will result in 
 * an `undefined` token in the DI container (i.e. IRequestHandler<undefined,{SomeOtherClass}>).
 */
class Bus implements IBus {
    private _requestHandlers: Map<string, IRequestHandler<unknown,unknown>> = new Map();
    private _eventHandlers: Map<string, IEventHandler<unknown>> = new Map()

    async send<TRequest extends IInput, TResult extends IResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>> {
        if (request.request === undefined && request.result === undefined) {
            return Err(new Error(`${REQUEST_HANDLER_CREATION_ERROR}: One of request or result must have a type. Did you forget to instantiate an object?`));
        }

        const handlerToken = createToken();
        const handler = this.getHandler(handlerToken, requestHandlerTypeRegistry, this._requestHandlers) as IRequestHandler<TRequest, TResult>;
        return await handler.handleAsync();

        function createToken (): string {
            const requestType = request.request?.constructor.name || 'void';
            const resultType = request.result?.constructor.name || 'void';
            return createRequestHandlerToken(requestType, resultType);
        }
    }
    async publish<TRequest extends IInput>(event: IEvent, strategy?: (handlers: Array<IEventHandler<TRequest>>, event: IEvent) => Promise<Array<void>>): Promise<Result<Array<void>, Error>> {
        if (event === undefined) {
            return Err(new Error(`${EVENT_HANDLER_CREATION_ERROR}: Event must be instantiated.`));
        }

        const requestType = event.constructor.name;
        const token = createEventHandlerToken(requestType);

        const handlers = this.getHandlers(token, eventHandlerTypeRegistry, this._eventHandlers) as Array<IEventHandler<TRequest>>;

        const publishMethod = strategy ?? this.defaultPublish;

        const results = await publishMethod(handlers, event);

        return Ok(results);
    }

    private async defaultPublish<TRequest> (handlers: Array<IEventHandler<TRequest>>, event: IEvent): Promise<Array<void>> {
        return await Promise.all(
            handlers.map(async (handler) => {
                await handler.handleAsync(event);
            })
        );
    }

    private createHandler<THandler> (handlerToken: string, handlerMap: Map<string,THandler>, handlerType: Type<THandler>): THandler {
        const handler = handlerMap.getOrAdd(handlerToken, () => Activator.resolve<THandler>(handlerType));

        if (handler === undefined) {
            throw Error(`${HANDLER_CREATION_ERROR}: Handler(s) could not be created for: ${handlerToken}.`);
        }

        return handler;
    }

    private getHandlerTypes<THandler>(handlerToken: string, handlerTypeRegistry: Map<string, Type<THandler>> | Map<string, Array<Type<THandler>>>): Type<THandler> | Array<Type<THandler>> {
        const result = handlerTypeRegistry.get(handlerToken);

        if (result === undefined) {
            throw Error(`${HANDLER_CREATION_ERROR}: Handler(s) not found for token: ${handlerToken}. Are you missing the \`requestHandler\` or \`eventHandler\` decorator?`);
        }

        return result;
    }

    private getHandlers<THandler> (handlerToken: string, handlerTypeRegistry: Map<string, Array<Type<THandler>>>, handlerMap: Map<string,THandler>): Array<THandler> {
        const handlerTypes = this.getHandlerTypes(handlerToken, handlerTypeRegistry) as Array<Type<THandler>>;

        const handlers: Array<THandler> = new Array<THandler>();

        handlerTypes.forEach(handlerType => {
            const handler = this.createHandler(`${handlerType.name}`, handlerMap, handlerType);
            handlers.push(handler);
        });

        return handlers;
    }

    private getHandler<THandler> (handlerToken: string, handlerTypeRegistry: Map<string,Type<THandler>>, handlerMap: Map<string,THandler>): THandler {
        const handlerType = this.getHandlerTypes(handlerToken, handlerTypeRegistry) as Type<THandler>;

        const handler = this.createHandler(handlerToken, handlerMap, handlerType);

        return handler;
    }
}

export { Bus };