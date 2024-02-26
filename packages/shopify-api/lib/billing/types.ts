import {
  BillingInterval,
  BillingReplacementBehavior,
  RecurringBillingIntervals,
} from '../types';
import {Session} from '../session/session';
import {FeatureEnabled, FutureFlagOptions} from '../../future/flags';

export interface BillingConfigPlan {
  /**
   * Amount to charge for this plan.
   */
  amount: number;
  /**
   * Currency code for this plan.
   */
  currencyCode: string;
}

export interface BillingConfigOneTimePlan extends BillingConfigPlan {
  /**
   * Interval for this plan.
   *
   * Must be set to `OneTime`.
   */
  interval: BillingInterval.OneTime;
}

export interface BillingConfigSubscriptionPlan extends BillingConfigPlan {
  /**
   * Recurring interval for this plan.
   *
   * Must be either `Every30Days` or `Annual`.
   */
  interval: Exclude<RecurringBillingIntervals, BillingInterval.Usage>;
  /**
   * How many trial days to give before charging for this plan.
   */
  trialDays?: number;
  /**
   * The behavior to use when replacing an existing subscription with a new one.
   */
  replacementBehavior?: BillingReplacementBehavior;
  /**
   * The discount to apply to this plan.
   */
  discount?: BillingConfigSubscriptionPlanDiscount;
}

export interface BillingConfigSubscriptionPlanDiscountAmount {
  /**
   * The amount to discount.
   *
   * Cannot be set if `percentage` is set.
   */
  amount: number;
  /**
   * The percentage to discount.
   *
   * Cannot be set if `amount` is set.
   */
  percentage?: never;
}

export interface BillingConfigSubscriptionPlanDiscountPercentage {
  /**
   * The amount to discount.
   *
   * Cannot be set if `percentage` is set.
   */
  amount?: never;
  /**
   * The percentage to discount.
   *
   * Cannot be set if `amount` is set.
   */
  percentage: number;
}

export interface BillingConfigSubscriptionPlanDiscount {
  /**
   * The number of intervals to apply the discount for.
   */
  durationLimitInIntervals?: number;
  /**
   * The discount to apply.
   */
  value:
    | BillingConfigSubscriptionPlanDiscountAmount
    | BillingConfigSubscriptionPlanDiscountPercentage;
}

export interface BillingConfigUsagePlan extends BillingConfigPlan {
  /**
   * Interval for this plan.
   *
   * Must be set to `Usage`.
   */
  interval: BillingInterval.Usage;
  /**
   * Usage terms for this plan.
   */
  usageTerms: string;
  /**
   * How many trial days to give before charging for this plan.
   */
  trialDays?: number;
  /**
   * The behavior to use when replacing an existing subscription with a new one.
   */
  replacementBehavior?: BillingReplacementBehavior;
}

export type BillingConfigLegacyItem =
  | BillingConfigOneTimePlan
  | BillingConfigSubscriptionPlan
  | BillingConfigUsagePlan;

export type BillingConfigItem<
  Future extends FutureFlagOptions = FutureFlagOptions,
> =
  FeatureEnabled<Future, 'v10_lineItemBilling'> extends true
    ? BillingConfigOneTimePlan | BillingConfigSubscriptionLineItemPlan
    : BillingConfigLegacyItem;

// Type this as an interface to improve TSDoc support for it.
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/**
 * Billing configuration options, indexed by an app-specific plan name.
 */
export interface BillingConfig<
  Future extends FutureFlagOptions = FutureFlagOptions,
> {
  /**
   * An individual billing plan.
   */
  [plan: string]: BillingConfigItem<Future>;
}
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

export type RequestConfigOverrides =
  | Partial<BillingConfigOneTimePlan>
  | Partial<BillingConfigSubscriptionPlan>
  | Partial<BillingConfigUsagePlan>;

export interface BillingConfigLineItem {
  /**
   * The amount to charge for this line item.
   */
  amount: number;
  /**
   * The currency code for this line item.
   */
  currencyCode: string;
}

export interface BillingConfigRecurringLineItem extends BillingConfigLineItem {
  /**
   * The recurring interval for this line item.
   *
   * Must be either `Every30Days` or `Annual`.
   */
  interval: BillingInterval.Every30Days | BillingInterval.Annual;
  /**
   * An optional discount to apply for this line item.
   */
  discount?: BillingConfigSubscriptionPlanDiscount;
}

export interface BillingConfigUsageLineItem extends BillingConfigLineItem {
  /**
   * The usage interval for this line item.
   *
   * Must be set to `Usage`.
   */
  interval: BillingInterval.Usage;
  /**
   * Usage terms for this line item.
   */
  terms: string;
}

export interface BillingConfigSubscriptionLineItemPlan {
  /**
   * The replacement behavior to use for this plan.
   */
  replacementBehavior?: BillingReplacementBehavior;
  /**
   * How many trial days to give before charging for this plan.
   */
  trialDays?: number;
  /**
   * The line items for this plan.
   */
  lineItems: (BillingConfigRecurringLineItem | BillingConfigUsageLineItem)[];
}

export type RequestConfigLineItemOverrides =
  Partial<BillingConfigSubscriptionLineItemPlan>;

export interface BillingCheckParams {
  /**
   * The session to use for this check.
   */
  session: Session;
  /**
   * The plans to accept for this check.
   */
  plans: string[] | string;
  /**
   * Whether to consider test purchases.
   */
  isTest?: boolean;
  /**
   * Whether to return the full response object.
   */
  returnObject?: boolean;
}

export interface BillingCheckResponseObject {
  /**
   * Whether the user has an active payment method.
   */
  hasActivePayment: boolean;
  /**
   * The one-time purchases the shop has.
   */
  oneTimePurchases: OneTimePurchase[];
  /**
   * The active subscriptions the shop has.
   */
  appSubscriptions: AppSubscription[];
}

export type BillingCheckResponse<Params extends BillingCheckParams> =
  Params['returnObject'] extends true ? BillingCheckResponseObject : boolean;

export type BillingRequestParams = {
  /**
   * The session to use for this request.
   */
  session: Session;
  /**
   * The plan to request.
   */
  plan: string;
  /**
   * Whether this is a test purchase.
   */
  isTest?: boolean;
  /**
   * Override the return URL after the purchase is complete.
   */
  returnUrl?: string;
  /**
   * Whether to return the full response object.
   */
  returnObject?: boolean;
} & RequestConfigOverrides;

export interface BillingRequestResponseObject {
  /**
   * The confirmation URL for this request.
   */
  confirmationUrl: string;
  /**
   * The one-time purchase created by this request.
   */
  oneTimePurchase?: OneTimePurchase;
  /**
   * The app subscription created by this request.
   */
  appSubscription?: AppSubscription;
}

export type BillingRequestResponse<Params extends BillingRequestParams> =
  Params['returnObject'] extends true ? BillingRequestResponseObject : string;

export interface BillingCancelParams {
  /**
   * The session to use for this request.
   */
  session: Session;
  /**
   * The subscription ID to cancel.
   */
  subscriptionId: string;
  /**
   * Whether to prorate the cancellation.
   */
  prorate?: boolean;
  /**
   * Whether to consider test purchases.
   */
  isTest?: boolean;
}

export interface BillingSubscriptionParams {
  /**
   * The session to use for this request.
   */
  session: Session;
}

export interface AppSubscription {
  /**
   * The ID of the app subscription.
   */
  id: string;
  /**
   * The name of the purchased plan.
   */
  name: string;
  /**
   * Whether this is a test subscription.
   */
  test: boolean;

  /*
   * The line items for this plan. This will become mandatory in v10.
   */
  lineItems?: ActiveSubscriptionLineItem[];
}

export interface ActiveSubscriptions {
  activeSubscriptions: AppSubscription[];
}

export interface ActiveSubscriptionLineItem {
  /*
   * The ID of the line item.
   */
  id: string;
  /*
   * The details of the plan.
   */
  plan: AppPlan;
}

export interface RecurringAppPlan {
  /*
   * The interval for this plan is charged on.
   */
  interval: BillingInterval.Every30Days | BillingInterval.Annual;
  /*
   * The price of the plan.
   */
  price: Money;
  /*
   * The discount applied to the plan.
   */
  discount: AppPlanDiscount;
}

export interface UsageAppPlan {
  /*
   * The total usage records for interval.
   */
  balanceUsed: Money;
  /*
   * The capped amount prevents the merchant from being charged for any usage over that amount during a billing period.
   */
  cappedAmount: Money;
  /*
   * The terms and conditions for app usage pricing.
   */
  terms: string;
}

interface Money {
  amount: number;
  currencyCode: string;
}

export interface AppPlanDiscount {
  /*
   * The total number of intervals the discount applies to.
   */
  durationLimitInIntervals: number;
  /*
   * The remaining number of intervals the discount applies to.
   */
  remainingDurationInIntervals: number;
  /*
   * The price after the discount is applied.
   */
  priceAfterDiscount: Money;
  /*
   * The value of the discount applied every billing interval.
   */
  value: AppPlanDiscountAmount;
}

type AppPlanDiscountAmount =
  | BillingConfigSubscriptionPlanDiscountAmount
  | BillingConfigSubscriptionPlanDiscountPercentage;

export interface AppPlan {
  /*
   * The pricing details of the plan.
   */
  pricingDetails: RecurringAppPlan | UsageAppPlan;
}
export interface OneTimePurchase {
  /**
   * The ID of the one-time purchase.
   */
  id: string;
  /**
   * The name of the purchased plan.
   */
  name: string;
  /**
   * Whether this is a test purchase.
   */
  test: boolean;
  /**
   * The status of the one-time purchase.
   */
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
  currentAppInstallation?: CurrentAppInstallation;
}

export interface RequestResponse {
  userErrors: string[];
  confirmationUrl: string;
}

interface AppSubscriptionCreate {
  userErrors: string[];
  confirmationUrl: string;
  appSubscription: AppSubscription;
}

interface AppPurchaseOneTimeCreate {
  userErrors: string[];
  confirmationUrl: string;
  oneTimePurchase: OneTimePurchase;
}

export interface RecurringPaymentResponse {
  appSubscriptionCreate?: AppSubscriptionCreate;
}

export interface SinglePaymentResponse {
  appPurchaseOneTimeCreate?: AppPurchaseOneTimeCreate;
}

export type RequestResponseData =
  | AppSubscriptionCreate
  | AppPurchaseOneTimeCreate;

export interface SubscriptionResponse {
  currentAppInstallation?: ActiveSubscriptions;
}

export interface CancelResponse {
  appSubscriptionCancel?: {
    appSubscription: AppSubscription;
    userErrors: string[];
  };
}
