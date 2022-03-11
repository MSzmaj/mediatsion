import { Result } from 'ts-results';
import { IEvent, IEventHandler, IRequest } from '..';

interface IBus {
    send<TRequest, TResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>>;
    publish<TRequest>(event: IEvent, strategy: (handlers: Array<IEventHandler<TRequest>>, event: IEvent) => Promise<Array<void>>): Promise<Result<Array<void>, Error>>;
}

export { IBus };