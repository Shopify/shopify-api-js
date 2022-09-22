import {SessionInterface} from '../session/types';
import {BillingInterval} from '../base-types';

import {shopifyBilling} from '.';

export interface BillingConfig {
  chargeName: string;
  amount: number;
  currencyCode: string;
  interval: BillingInterval;
}

export interface CheckInterface {
  session: SessionInterface;
  isTest?: boolean;
}

export interface CheckReturn {
  hasPayment: boolean;
  confirmBillingUrl?: string;
}

export interface ActiveSubscription {
  name: string;
  test: boolean;
}

export interface ActiveSubscriptions {
  activeSubscriptions: ActiveSubscription[];
}

export interface OneTimePurchase {
  name: string;
  test: boolean;
  status: string;
}

export interface OneTimePurchases {
  oneTimePurchases: {
    edges: {
      node: OneTimePurchase;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

export interface CurrentAppInstallations<T> {
  userErrors: string[];
  data: {
    currentAppInstallation: T;
  };
}

export interface RequestResponse {
  userErrors: string[];
  confirmationUrl: string;
}

export interface RecurringPaymentResponse {
  data: {
    appSubscriptionCreate: RequestResponse;
  };
  errors?: string[];
}

export interface SinglePaymentResponse {
  data: {
    appPurchaseOneTimeCreate: RequestResponse;
  };
  errors?: string[];
}

export type ShopifyBilling = ReturnType<typeof shopifyBilling>;
