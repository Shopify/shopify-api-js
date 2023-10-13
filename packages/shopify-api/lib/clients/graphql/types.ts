import {ApiVersion} from '../../types';
import {Session} from '../../session/session';
import {RequestReturn} from '../http_client/types';

export interface GraphqlClientParams {
  session: Session;
  apiVersion?: ApiVersion;
}

export interface AllOperations {
  [key: string]: {return: any; variables?: any};
}

export type InputMaybe<_R = never> = never;

type UnpackedInput<InputType> = 'input' extends keyof InputType
  ? InputType['input']
  : InputType;

type UnpackedInputMaybe<InputType> = InputType extends InputMaybe<infer R>
  ? InputMaybe<UnpackedInput<R>>
  : UnpackedInput<InputType>;

export type OperationRequest<
  Operations extends AllOperations,
  T extends keyof Operations,
> = Operations[T]['variables'] extends {[key: string]: never}
  ? {query: T; variables?: never}
  : {
      query: T;
      variables: {
        [k in keyof Operations[T]['variables']]: UnpackedInputMaybe<
          Operations[T]['variables'][k]
        >;
      };
    };

export type RequestData<
  T,
  Operations extends AllOperations,
> = T extends keyof Operations
  ? OperationRequest<Operations, T>
  : {[key: string]: unknown} | string;

export type ReturnBody<
  T,
  Operations extends AllOperations,
> = T extends keyof Operations ? {data: Operations[T]['return']} : any;

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string;
}

export type GraphqlProxy = (
  params: GraphqlProxyParams,
) => Promise<RequestReturn>;
