/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('User resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"users": [{"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "create_store_credit_account_transactions", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "delete_products", "domains", "draft_orders", "create_and_edit_draft_orders", "apply_discounts_to_draft_orders", "mark_draft_orders_as_paid", "set_payment_terms_for_draft_orders", "delete_draft_orders", "edit_orders", "edit_private_apps", "edit_product_cost", "edit_product_price", "edit_theme_code", "gift_cards", "links", "locations", "manage_delivery_settings", "manage_inventory", "manage_policies", "manage_product_tags", "manage_products", "manage_store_credit_settings", "manage_taxes_settings", "marketing", "marketing_section", "metaobjects_delete", "metaobjects_edit", "metaobjects_view", "metaobject_definitions_delete", "metaobject_definitions_edit", "metaobject_definitions_view", "merge_customers", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_all_shopify_credit_transactions", "view_balance_bank_accounts", "view_private_apps", "view_product_costs", "view_store_credit_account_transactions", "apply_discounts_to_orders", "fulfill_and_ship_orders", "buy_shipping_labels", "return_orders", "manage_abandoned_checkouts", "cancel_orders", "delete_orders", "manage_orders_information", "set_payment_terms_for_orders", "mark_orders_as_paid", "capture_payments_for_orders", "view_companies", "create_and_edit_companies", "delete_companies", "manage_company_location_assignments", "third_party_money_movement", "export_customers", "export_draft_orders", "export_orders", "export_products", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "domains_transfer_out", "enable_private_apps", "experiments_management", "manage_all_shopify_credit_cards", "manage_tap_to_pay", "payment_settings", "upgrade_to_plus_plan", "shopify_payments", "sqlite_bulk_data_transfer", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "view_price_lists", "delete_price_lists", "create_and_edit_price_lists", "view_catalogs", "delete_catalogs", "create_and_edit_catalogs"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/AdminUserSerializer/548380009", "tfa_enabled?": false}, {"id": 930143300, "first_name": "John", "email": "j.limited@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Limited", "account_owner": false, "receive_announcements": 1, "bio": null, "permissions": [], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/AdminUserSerializer/930143300", "tfa_enabled?": false}]}));

    await shopify.rest.User.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/users.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"user": {"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "create_store_credit_account_transactions", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "delete_products", "domains", "draft_orders", "create_and_edit_draft_orders", "apply_discounts_to_draft_orders", "mark_draft_orders_as_paid", "set_payment_terms_for_draft_orders", "delete_draft_orders", "edit_orders", "edit_private_apps", "edit_product_cost", "edit_product_price", "edit_theme_code", "gift_cards", "links", "locations", "manage_delivery_settings", "manage_inventory", "manage_policies", "manage_product_tags", "manage_products", "manage_store_credit_settings", "manage_taxes_settings", "marketing", "marketing_section", "metaobjects_delete", "metaobjects_edit", "metaobjects_view", "metaobject_definitions_delete", "metaobject_definitions_edit", "metaobject_definitions_view", "merge_customers", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_all_shopify_credit_transactions", "view_balance_bank_accounts", "view_private_apps", "view_product_costs", "view_store_credit_account_transactions", "apply_discounts_to_orders", "fulfill_and_ship_orders", "buy_shipping_labels", "return_orders", "manage_abandoned_checkouts", "cancel_orders", "delete_orders", "manage_orders_information", "set_payment_terms_for_orders", "mark_orders_as_paid", "capture_payments_for_orders", "view_companies", "create_and_edit_companies", "delete_companies", "manage_company_location_assignments", "third_party_money_movement", "export_customers", "export_draft_orders", "export_orders", "export_products", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "domains_transfer_out", "enable_private_apps", "experiments_management", "manage_all_shopify_credit_cards", "manage_tap_to_pay", "payment_settings", "upgrade_to_plus_plan", "shopify_payments", "sqlite_bulk_data_transfer", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "view_price_lists", "delete_price_lists", "create_and_edit_price_lists", "view_catalogs", "delete_catalogs", "create_and_edit_catalogs"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/AdminUserSerializer/548380009", "tfa_enabled?": false}}));

    await shopify.rest.User.find({
      session: session,
      id: 548380009,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/users/548380009.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"user": {"id": 548380009, "first_name": "John", "email": "j.smith@example.com", "url": "www.example.com", "im": null, "screen_name": null, "phone": null, "last_name": "Smith", "account_owner": true, "receive_announcements": 1, "bio": null, "permissions": ["applications", "beacons", "billing_application_charges", "channels", "content", "content_entries_delete", "content_entries_edit", "content_entries_view", "content_models_delete", "content_models_edit", "content_models_view", "create_store_credit_account_transactions", "custom_pixels_management", "custom_pixels_view", "customers", "dashboard", "delete_products", "domains", "draft_orders", "create_and_edit_draft_orders", "apply_discounts_to_draft_orders", "mark_draft_orders_as_paid", "set_payment_terms_for_draft_orders", "delete_draft_orders", "edit_orders", "edit_private_apps", "edit_product_cost", "edit_product_price", "edit_theme_code", "gift_cards", "links", "locations", "manage_delivery_settings", "manage_inventory", "manage_policies", "manage_product_tags", "manage_products", "manage_store_credit_settings", "manage_taxes_settings", "marketing", "marketing_section", "metaobjects_delete", "metaobjects_edit", "metaobjects_view", "metaobject_definitions_delete", "metaobject_definitions_edit", "metaobject_definitions_view", "merge_customers", "orders", "overviews", "pages", "pay_draft_orders_by_credit_card", "pay_orders_by_credit_card", "pay_orders_by_vaulted_card", "preferences", "products", "refund_orders", "reports", "translations", "themes", "view_all_shopify_credit_transactions", "view_balance_bank_accounts", "view_private_apps", "view_product_costs", "view_store_credit_account_transactions", "apply_discounts_to_orders", "fulfill_and_ship_orders", "buy_shipping_labels", "return_orders", "manage_abandoned_checkouts", "cancel_orders", "delete_orders", "manage_orders_information", "set_payment_terms_for_orders", "mark_orders_as_paid", "capture_payments_for_orders", "view_companies", "create_and_edit_companies", "delete_companies", "manage_company_location_assignments", "third_party_money_movement", "export_customers", "export_draft_orders", "export_orders", "export_products", "shopify_payments_accounts", "shopify_payments_transfers", "staff_audit_log_view", "staff_management_update", "applications_billing", "attestation_authority", "authentication_management", "balance_bank_accounts_management", "billing_charges", "billing_invoices_pay", "billing_invoices_view", "billing_payment_methods_manage", "billing_payment_methods_view", "billing_settings", "billing_subscriptions", "capital", "customer_private_data", "erase_customer_data", "request_customer_data", "domains_management", "domains_transfer_out", "enable_private_apps", "experiments_management", "manage_all_shopify_credit_cards", "manage_tap_to_pay", "payment_settings", "upgrade_to_plus_plan", "shopify_payments", "sqlite_bulk_data_transfer", "staff_api_permission_management", "staff_management", "staff_management_activation", "staff_management_create", "staff_management_delete", "support_methods", "collaborator_request_management", "collaborator_request_settings", "view_price_lists", "delete_price_lists", "create_and_edit_price_lists", "view_catalogs", "delete_catalogs", "create_and_edit_catalogs"], "locale": "en", "user_type": "regular", "admin_graphql_api_id": "gid://shopify/AdminUserSerializer/548380009", "tfa_enabled?": false}}));

    await shopify.rest.User.current({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/users/current.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
