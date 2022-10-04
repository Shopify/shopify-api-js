/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {User} from '../../2022-04';

describe('User resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"users": [{"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "domains", "draft_orders", "edit_orders", "edit_private_apps", "gift_cards", "links", "locations", "marketing", "marketing_section", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_private_apps", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "shopify_credit", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "enable_private_apps", "experiments_management", "gdpr_actions", "payment_settings", "shopify_payments", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "export_customers", "export_draft_orders", "export_orders", "export_products"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/StaffMember/548380009", "tfa_enabled?": false}, {"id": 930143300, "first_name": "John", "email": "j.limited@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Limited", "account_owner": false, "receive_announcements": 1, "bio": null, "permissions": [], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/StaffMember/930143300", "tfa_enabled?": false}]}));

    await User.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/users.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"user": {"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "domains", "draft_orders", "edit_orders", "edit_private_apps", "gift_cards", "links", "locations", "marketing", "marketing_section", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_private_apps", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "shopify_credit", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "enable_private_apps", "experiments_management", "gdpr_actions", "payment_settings", "shopify_payments", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "export_customers", "export_draft_orders", "export_orders", "export_products"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/StaffMember/548380009", "tfa_enabled?": false}}));

    await User.find({
      session: test_session,
      id: 548380009,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/users/548380009.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"user": {"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "domains", "draft_orders", "edit_orders", "edit_private_apps", "gift_cards", "links", "locations", "marketing", "marketing_section", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_private_apps", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "shopify_credit", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "enable_private_apps", "experiments_management", "gdpr_actions", "payment_settings", "shopify_payments", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "export_customers", "export_draft_orders", "export_orders", "export_products"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/StaffMember/548380009", "tfa_enabled?": false}}));

    await User.current({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/users/current.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
