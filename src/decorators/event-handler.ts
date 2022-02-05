import { createEventHandlerToken, IEventHandler } from "..";

const eventHandlerTypeRegistry: Map<string,Array<Type<IEventHandler<unknown>>>> = new Map();

const eventHandler = (eventType: string): GenericClassDecorator<Type<IEventHandler<unknown>>> => {
    return (target: Type<IEventHandler<unknown>>) => {
        const token = createEventHandlerToken(eventType);

        let handlers = eventHandlerTypeRegistry.get(token);
        if (handlers === undefined) {
            handlers = [target];
        } else {
            handlers.push(target);
        }

        eventHandlerTypeRegistry.set(token, handlers);
    }
}

export { eventHandler, eventHandlerTypeRegistry };