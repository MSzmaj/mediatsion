
function createRequestHandlerToken (requestType: string, resultType: string) {
    return `IRequestHandler<${requestType},${resultType}>`;;
}

export { createRequestHandlerToken };