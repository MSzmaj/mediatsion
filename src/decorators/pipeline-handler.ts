import { createRequestHandlerToken } from "../../dist";
import { IPipelineHandler } from "../interfaces/i-pipeline-handler"

const preprocessHandlerTypeRegistry: Map<string, Array<Type<IPipelineHandler<unknown,unknown>>>> = new Map();
const postProcessHandlerTypeRegistry: Map<string, Array<Type<IPipelineHandler<unknown,unknown>>>> = new Map();

const preprocessHandler = (requestType: string, resultType: string): GenericClassDecorator<Type<IPipelineHandler<unknown,unknown>>> => {
    return (target: Type<IPipelineHandler<unknown,unknown>>) => {
        const token = createRequestHandlerToken(requestType, resultType);
        if (preprocessHandlerTypeRegistry.has(token)) {
            preprocessHandlerTypeRegistry.get(token)!.push(target);
            return;
        }

        preprocessHandlerTypeRegistry.set(token, [target]);
    }
}

const postProcessHandler = (requestType: string, resultType: string): GenericClassDecorator<Type<IPipelineHandler<unknown,unknown>>> => {
    return (target: Type<IPipelineHandler<unknown,unknown>>) => {
        const token = createRequestHandlerToken(requestType, resultType);
        if (postProcessHandlerTypeRegistry.has(token)) {
            postProcessHandlerTypeRegistry.get(token)!.push(target);
            return;
        }

        postProcessHandlerTypeRegistry.set(token, [target]);
    }
}



export { preprocessHandler, postProcessHandler, preprocessHandlerTypeRegistry, postProcessHandlerTypeRegistry };