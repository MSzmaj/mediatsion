import { Result } from "ts-results";
import { IRequest } from "..";
import { IRequestHandler } from "../../dist";
import { postProcessHandlerTypeRegistry, preprocessHandlerTypeRegistry } from "../decorators/pipeline-handler";

class RequestHandlerWrapper<TRequest,TResult> {
    private readonly _requestHandler: IRequestHandler<TRequest,TResult>;

    public constructor (requestHandler: IRequestHandler<TRequest, TResult>) {
        this._requestHandler = requestHandler;
    }

    async handleAsync (request?: IRequest<TRequest,TResult>): Promise<Result<TResult,Error>> {
        preprocessHandlerTypeRegistry.forEach();
        
        const result = await this._requestHandler.handleAsync()

        postProcessHandlerTypeRegistry

        return result;
    }
}