import { Result } from 'ts-results';
import { IEvent, IRequest } from '..';

interface IBus {
    send<TRequest, TResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>>;
    publish<TRequest>(event: IEvent): Promise<Result<void[], Error>>;
}

export { IBus };