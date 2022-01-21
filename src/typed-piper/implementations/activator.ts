const Activator = new class {
    resolve<T>(target: Type<any>): T {
      //@ts-ignore
      let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
          injections = tokens.map((token: Type<any>) => Activator.resolve<any>(token));
      
      return new target(...injections);
    }
  };

  export { Activator };