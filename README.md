# mediaTSion
An in-process mediator/pipeline library for Typescript.

**NOTE: Work in progress**

## Pre-requisites 
**IMPORTANT:** [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata) must be imported at the start of the application and only once.

## Packages
Install `reflect-metadata`: 
```
npm install reflect-metadata
```

Install `mediatsion`:
```
npm install mediatsion
```

## **How-To:**
### **1A. Create new Request:**
```typescript
class ExampleRequest implements IRequest<ExampleInput, ExampleResult> {
    request: ExampleInput = new ExmapleInput();
    result: ExampleResult = new ExampleResult();
}

class ExampleInput implements IInput {
    example: string;
}

class ExampleResult implements IResult {
    id: string;
}
```

### **1B. Create new Event:**
```typescript
class ExampleEvent implements IEvent {
    example: string
}
```

### **2A. Create a new Command/Request Handler:**
```typescript
@requestHandler('ExampleRequest','ExampleResult')
class ExampleCommandHandler implements IRequestHandler<ExampleRequest, ExampleResult>  {
    async handleAsync(): Promise<Result<ExampleResult, Error>> {
        let result: Result<ExampleResult, Error>;
        try {
            //do stuff
            result = Ok(returnModel);
        } catch (error) {
            result = Err(new Error());
        } 
        
        return result;
    }
}
```

**NOTE:** Currently you need to pass in the name of the `Request` and `Result` objects as strings. 

**NOTE:** The name of the handler; while it is a `IRequestHandler` it might be best to name it either *CommandHandler or *QueryHandler for readability. Typically `Commands` will not provide a `Result` object.

### **2B. Create a new Event handler:**
```typescript
@eventHandler('ExampleEvent')
class ExampleEventHandler implements IEventHandler<ExampleEvent>  {
    async handleAsync(): Promise<void> {
        //do stuff
    }
}
```
**NOTE:** Currently you need to pass in the name of the `Event` object as a string.
### **3. Use `Bus` to `mediate`:**
```typescript
import { Bus } from mediatsion;

const bus: Bus = new Bus();
const exampleRequestHandler = new ExampleRequestHandler();
const requestResult = await bus.send(exampleRequestHandler);

const exampleEvent = new ExampleEvent;
const eventResult = await bus.publish(exampleEvent); //NOTE: this will always be a void array. Only check for result.ok.
```

### **3A. Create a publish strategy:**

A strategy will allow you to run event handlers in a different order than registered. This will allow you to run them in parallel as well.

```typescript
const strategy = async (handlers: IEventHandler<TestEvent>[], event: IEvent): Promise<Array<void>> => {
        const result: Array<void> = [];
        for (let i = handlers.length-1; i >= 0; i--) {
            result.push(await handlers[i].handleAsync(event));
        }
        return result;
    }

const reuslt = await bus.publish(exampleEvent, strategy);
```

## Release Notes:
### 0.1.2:
* Publish strategies

## Roadmap:
### 0.1.3:
* Pipeline functionality

### 1.0.0:
* Production ready release
