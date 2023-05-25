import {
  BillingInterval,
  BillingReplacementBehavior,
  RecurringBillingIntervals,
} from '../types';
import {Session} from '../session/session';

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
  discount?: BillingConfigSubscriptionPlanDiscount;
}

export interface BillingConfigSubscriptionPlanDiscountAmount {
  amount: number;
  percentage?: never;
}

export interface BillingConfigSubscriptionPlanDiscountPercentage {
  amount?: never;
  percentage: number;
}

export interface BillingConfigSubscriptionPlanDiscount {
  durationLimitInIntervals?: number;
  value:
    | BillingConfigSubscriptionPlanDiscountAmount
    | BillingConfigSubscriptionPlanDiscountPercentage;
}

export interface BillingConfigUsagePlan extends BillingConfigPlan {
  interval: BillingInterval.Usage;
  usageTerms: string;
  trialDays?: number;
  replacementBehavior?: BillingReplacementBehavior;
}

export interface BillingConfig {
  [plan: string]:
    | BillingConfigOneTimePlan
    | BillingConfigSubscriptionPlan
    | BillingConfigUsagePlan;
}

export interface BillingCheckParams {
  session: Session;
  plans: string[] | string;
  isTest?: boolean;
}

export interface BillingRequestParams {
  session: Session;
  plan: string;
  isTest?: boolean;
  returnUrl?: string;
}

export interface BillingCancelParams {
  session: Session;
  subscriptionId: string;
  prorate?: boolean;
  isTest?: boolean;
}

export interface BillingSubscriptionParams {
  session: Session;
}

export interface AppSubscription {
  id: string;
  name: string;
  test: boolean;
}

export interface ActiveSubscriptions {
  activeSubscriptions: AppSubscription[];
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

export interface SubscriptionResponse {
  data: {
    currentAppInstallation: ActiveSubscriptions;
  };
  errors?: string[];
}

export interface CancelResponse {
  data: {
    appSubscriptionCancel: {
      appSubscription: AppSubscription;
      userErrors: string[];
    };
  };
  errors?: string[];
}
