import { createEventHandlerToken, GenericClassDecorator, IEventHandler } from "..";

const eventHandlerTypeRegistry: Map<string,Array<Type<IEventHandler<any>>>> = new Map();

const eventHandler = (eventType: string): GenericClassDecorator<Type<IEventHandler<any>>> => {
    return (target: Type<IEventHandler<any>>) => {
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