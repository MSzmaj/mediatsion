# mediaTS
An in-process mediator/pipeline library for Typescript and NodeJS.

## **NOTE: Work in progress**

# Getting Started
## Pre-requisites 
**IMPORTANT:** `reflect-metadata` must be imported at the start of the application and only once.

## Packages
Install `reflect-metadata`: 
```
    npm install reflect-metadata
```

Install `mediats`:
```
    npm install mediats
```

## **How-To:**
### **1A. Create new Request:**
```
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
```
class ExampleEvent implements IEvent {
    example: string
}
```

### **2A. Create a new Command/Request Handler:**
```
@requestHandler('ExampleRequest','ExampleResult')
class ExampleCommandHandler implements IRequestHandler<ExampleRequest, ExampleResult>  {
    private _exampleRepository: Repository<ExampleEntity>;

    public constructor () {
        this._exampleRepository = getRepository(ExampleEntity);
    }

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

**NOTE:** he name of the handler; while it is a `IRequestHandler` it might be best to name it either *CommandHandler or *QueryHandler for readability. Typically `Commands` will not provide a `Result` object.

### **2B. Create a new Event handler:**
```
@eventHandler('ExampleEvent')
class ExampleEventHandler implements IEventHandler<ExampleEvent>  {
    async handleAsync(): Promise<void> {
        //to stuff
    }
}
```
**NOTE:** Currently you need to pass in the name of the `Event` object as a string.
### **3. Use `Bus` to `mediate`:**
```
import { Bus } from mediats;

const bus: Bus = new Bus();
const exampleRequestHandler = new ExampleRequestHandler();
const result = await bus.send(exampleRequestHandler);

if (result.ok) {
    //perform work.
} else {
    //handle error.
}

const exampleEventHandler = new ExampleEventHandler();
await bus.publish(exampleEventHandler);

//perform work
```

## Release Notes:
### 0.1.1:
* Type safety
* Send and publish functionality

## Roadmap:
### 0.1.2:
* Pipeline functionality
* Publish strategies

### 0.1.3:
* DI framework compatability (other than tsyringe)

### 1.0.0:
* Production ready release
