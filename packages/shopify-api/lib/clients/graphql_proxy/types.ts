import type {ClientResponse} from '@shopify/graphql-client';

import {Session} from '../../session/session';
import {FeatureEnabled, FutureFlagOptions} from '../../../future/flags';
import {RequestReturn} from '../types';

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string;
}

export type GraphqlProxy<Future extends FutureFlagOptions> = (
  params: GraphqlProxyParams,
) => Promise<
  FeatureEnabled<Future, 'unstable_newApiClients'> extends true
    ? ClientResponse
    : RequestReturn
>;
