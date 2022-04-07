import { IRequest } from "./i-request";

interface IPipelineHandler<TRequest, TResult> {
    handleAsync (request?: IRequest<TRequest, TResult>): Promise<void>;    
}

export { IPipelineHandler };