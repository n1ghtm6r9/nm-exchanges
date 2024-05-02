declare module '@nmxjs/validation' {
  interface IFieldOptions {
    type: String | Number | Boolean | object;
    enum?: boolean;
    array?: boolean;
    nullable?: boolean;
  }
  const Field: (options: IFieldOptions) => PropertyDecorator;
  const validatorKey: string;
  class ValidationModule {}
  interface IValidator {
    validate(...params);
  }
}

declare module '@nmxjs/types' {
  type ProxyDto = any;
}
