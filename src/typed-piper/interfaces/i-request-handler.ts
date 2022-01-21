import { Result } from 'ts-results';
import { IRequest } from '..';

/**
 * All request handlers need to implement this interface in order to use `Bus` as a mediator.
 */
interface IRequestHandler<TRequest, TResult> {
    handleAsync (request?: IRequest<TRequest, TResult>): Promise<Result<TResult, Error>>;
}

export { IRequestHandler };