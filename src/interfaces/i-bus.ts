import { Result } from 'ts-results';
import { IRequest } from '..';

interface IBus {
    send<TRequest, TResult>(request: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>>;
    publish(event: Event): Promise<void>;
}

export { IBus };