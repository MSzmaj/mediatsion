/**
 * All requests used in request handlers need to implement this interface.
 * Due to the lack of types in JS, you must instantiate the request/result objects in order to determine 
 * the correct types. You can leave one of the request/results uninstantiated, but, this will result in 
 * an `undefined` token in the DI container (i.e. IRequestHandler<undefined,{SomeOtherClass}>).
 */
 interface IRequest<TRequest, TResult> {
    request: TRequest;
    result: TResult;
}

export { IRequest };