const Activator = new class {
    resolve<T>(target: Type<T>): T {
      //@ts-ignore
      const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
      const injections = tokens.map((token: Type<T>) => Activator.resolve<T>(token));
      
      return new target(...injections);
    }
  };

  export { Activator };