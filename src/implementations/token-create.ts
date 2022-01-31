function createRequestHandlerToken (requestType: string, resultType: string): string {
    return `IRequestHandler<${requestType},${resultType}>`;
}

function createEventHandlerToken (event: string): string {
    return `${event}`;
}

export { createRequestHandlerToken, createEventHandlerToken };