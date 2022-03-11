import { IEvent } from "..";

/**
 * All notification handlers need to implement this interface in order to use `Bus` as a mediator.
 */
interface IEventHandler<TEvent> {
    handleAsync (event: IEvent): Promise<void>;
}

export { IEventHandler };