export type InputMaybe<_R = never> = never;

export interface AllOperations {
  [key: string]: { variables: any; return: any };
  [key: number | symbol]: never;
}

type UnpackedInput<InputType> = "input" extends keyof InputType
  ? InputType["input"]
  : InputType;

type UnpackedInputMaybe<InputType> =
  InputType extends InputMaybe<infer R>
    ? InputMaybe<UnpackedInput<R>>
    : UnpackedInput<InputType>;

export type OperationVariables<
  Operation extends keyof Operations,
  Operations extends AllOperations,
> =
  Operations[Operation]["variables"] extends Record<string, never>
    ? Record<string, never>
    : {
        variables?: {
          [k in keyof Operations[Operation]["variables"]]: UnpackedInputMaybe<
            Operations[Operation]["variables"][k]
          >;
        };
      };

export type ResponseWithType<T = any> = Omit<Response, "json"> & {
  json: () => Promise<T>;
};

export type ReturnData<
  Operation extends keyof Operations,
  Operations extends AllOperations,
> = Operation extends keyof Operations ? Operations[Operation]["return"] : any;
