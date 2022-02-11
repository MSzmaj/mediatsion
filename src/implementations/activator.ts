const Activator = new class {
    resolve<T>(target: Type<T>): T {
      //@ts-ignore due to lack of reflect-metadata reference. Should be imported at the beginning of each project only once.
      const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
      const injections = tokens.map((token: Type<T>) => Activator.resolve<T>(token));
      
      return new target(...injections);
    }
  };

  export { Activator };