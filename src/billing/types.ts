export enum BillingInterval {
  OneTime = 'ONE_TIME',
  Every30Days = 'EVERY_30_DAYS',
  Annual = 'ANNUAL',
}

export interface BillingSettings {
  chargeName: string;
  amount: number;
  currencyCode: string;
  interval: BillingInterval;
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
