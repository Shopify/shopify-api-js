import {SessionInterface} from '../session/types';
import {
  BillingInterval,
  BillingReplacementBehavior,
  RecurringBillingIntervals,
} from '../base-types';

import {shopifyBilling} from '.';

export interface BillingConfigPlan {
  amount: number;
  currencyCode: string;
}

export interface BillingConfigOneTimePlan extends BillingConfigPlan {
  interval: BillingInterval.OneTime;
}

export interface BillingConfigSubscriptionPlan extends BillingConfigPlan {
  interval: RecurringBillingIntervals;
  trialDays?: number;
  replacementBehavior?: BillingReplacementBehavior;
}

export interface BillingConfig {
  [plan: string]: BillingConfigOneTimePlan | BillingConfigSubscriptionPlan;
}

export interface CheckParams {
  session: SessionInterface;
  plans: string[] | string;
  isTest?: boolean;
}

export interface RequestParams {
  session: SessionInterface;
  plan: string;
  isTest?: boolean;
}

interface ActiveSubscription {
  name: string;
  test: boolean;
}

interface ActiveSubscriptions {
  activeSubscriptions: ActiveSubscription[];
}

interface OneTimePurchase {
  name: string;
  test: boolean;
  status: string;
}

interface OneTimePurchases {
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

export type CurrentAppInstallation = OneTimePurchases & ActiveSubscriptions;

export interface CurrentAppInstallations {
  userErrors: string[];
  data: {
    currentAppInstallation: CurrentAppInstallation;
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
