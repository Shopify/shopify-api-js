import {
  BillingInterval,
  BillingReplacementBehavior,
  RecurringBillingIntervals,
} from '../types';
import {Session} from '../session/session';
import {FeatureEnabled, FutureFlagOptions} from '../../future/flags';

export interface BillingConfigPlan {
  amount: number;
  currencyCode: string;
}

export interface BillingConfigOneTimePlan extends BillingConfigPlan {
  interval: BillingInterval.OneTime;
}

export interface BillingConfigSubscriptionPlan extends BillingConfigPlan {
  interval: Exclude<RecurringBillingIntervals, BillingInterval.Usage>;
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

export type BillingConfigLegacyItem =
  | BillingConfigOneTimePlan
  | BillingConfigSubscriptionPlan
  | BillingConfigUsagePlan;

export type BillingConfigItem<
  Future extends FutureFlagOptions = FutureFlagOptions,
> = FeatureEnabled<Future, 'unstable_lineItemBilling'> extends true
  ? BillingConfigOneTimePlan | BillingConfigSubscriptionLineItemPlan
  : BillingConfigLegacyItem;

export interface BillingConfig<
  Future extends FutureFlagOptions = FutureFlagOptions,
> {
  [plan: string]: BillingConfigItem<Future>;
}

export type RequestConfigOverrides =
  | Partial<BillingConfigOneTimePlan>
  | Partial<BillingConfigSubscriptionPlan>
  | Partial<BillingConfigUsagePlan>;

export interface BillingConfigLineItem {
  amount: number;
  currencyCode: string;
}

export interface BillingConfigRecurringLineItem extends BillingConfigLineItem {
  interval: BillingInterval.Every30Days | BillingInterval.Annual;
  discount?: BillingConfigSubscriptionPlanDiscount;
}

export interface BillingConfigUsageLineItem extends BillingConfigLineItem {
  interval: BillingInterval.Usage;
  terms: string;
}

export interface BillingConfigSubscriptionLineItemPlan {
  replacementBehavior?: BillingReplacementBehavior;
  trialDays?: number;
  lineItems: (BillingConfigRecurringLineItem | BillingConfigUsageLineItem)[];
}

export type RequestConfigLineItemOverrides =
  Partial<BillingConfigSubscriptionLineItemPlan>;

export interface BillingCheckParams {
  session: Session;
  plans: string[] | string;
  isTest?: boolean;
  returnObject?: boolean;
}

export interface BillingCheckResponseObject {
  hasActivePayment: boolean;
  oneTimePurchases: OneTimePurchase[];
  appSubscriptions: AppSubscription[];
}

export type BillingCheckResponse<Params extends BillingCheckParams> =
  Params['returnObject'] extends true ? BillingCheckResponseObject : boolean;

export type BillingRequestParams = {
  session: Session;
  plan: string;
  isTest?: boolean;
  returnUrl?: string;
  returnObject?: boolean;
} & RequestConfigOverrides;

export interface BillingRequestResponseObject {
  confirmationUrl: string;
  oneTimePurchase?: OneTimePurchase;
  appSubscription?: AppSubscription;
}

export type BillingRequestResponse<Params extends BillingRequestParams> =
  Params['returnObject'] extends true ? BillingRequestResponseObject : string;

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

export interface OneTimePurchase {
  id: string;
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
    appSubscriptionCreate: {
      userErrors: string[];
      confirmationUrl: string;
      appSubscription: AppSubscription;
    };
  };
  errors?: string[];
}

export interface SinglePaymentResponse {
  data: {
    appPurchaseOneTimeCreate: {
      userErrors: string[];
      confirmationUrl: string;
      oneTimePurchase: OneTimePurchase;
    };
  };
  errors?: string[];
}

export type RequestResponseData =
  | RecurringPaymentResponse['data']['appSubscriptionCreate']
  | SinglePaymentResponse['data']['appPurchaseOneTimeCreate'];

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
