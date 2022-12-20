/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('MobilePlatformApplication resource', () => {
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
    queueMockResponse(JSON.stringify({"mobile_platform_applications": [{"id": 1066176058, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-11-29T17:07:58-05:00", "updated_at": "2022-11-29T17:07:58-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}, {"id": 1066176059, "application_id": "com.example", "platform": "android", "created_at": "2022-11-29T17:07:58-05:00", "updated_at": "2022-11-29T17:07:58-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false}]}));

    await shopify.rest.MobilePlatformApplication.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066176055, "application_id": "com.example", "platform": "android", "created_at": "2022-11-29T17:07:53-05:00", "updated_at": "2022-11-29T17:07:53-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.platform = "android";
    mobile_platform_application.application_id = "com.example";
    mobile_platform_application.sha256_cert_fingerprints = [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ];
    mobile_platform_application.enabled_universal_or_app_links = true;
    await mobile_platform_application.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "android", "application_id": "com.example", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066176052, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-11-29T17:07:49-05:00", "updated_at": "2022-11-29T17:07:49-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.platform = "ios";
    mobile_platform_application.application_id = "X1Y2.ca.domain.app";
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    await mobile_platform_application.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "ios", "application_id": "X1Y2.ca.domain.app", "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066176053, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-11-29T17:07:49-05:00", "updated_at": "2022-11-29T17:07:49-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}}));

    await shopify.rest.MobilePlatformApplication.find({
      session: session,
      id: 1066176053,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications/1066176053.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"mobile_platform_application": {"application_id": "com.example.news.app", "platform": "android", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "id": 1066176057, "created_at": "2022-11-29T17:07:56-05:00", "updated_at": "2022-11-29T17:07:58-05:00"}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.id = 1066176057;
    mobile_platform_application.application_id = "com.example.news.app";
    mobile_platform_application.platform = "android";
    mobile_platform_application.created_at = "2022-11-29T17:07:56-05:00";
    mobile_platform_application.updated_at = "2022-11-29T17:07:56-05:00";
    mobile_platform_application.sha256_cert_fingerprints = [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = false;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications/1066176057.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"application_id": "com.example.news.app", "platform": "android", "created_at": "2022-11-29T17:07:56-05:00", "updated_at": "2022-11-29T17:07:56-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"mobile_platform_application": {"application_id": "A1B2.ca.domain.app", "platform": "ios", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "id": 1066176054, "created_at": "2022-11-29T17:07:50-05:00", "updated_at": "2022-11-29T17:07:52-05:00"}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.id = 1066176054;
    mobile_platform_application.application_id = "A1B2.ca.domain.app";
    mobile_platform_application.platform = "ios";
    mobile_platform_application.created_at = "2022-11-29T17:07:50-05:00";
    mobile_platform_application.updated_at = "2022-11-29T17:07:50-05:00";
    mobile_platform_application.sha256_cert_fingerprints = [];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications/1066176054.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"application_id": "A1B2.ca.domain.app", "platform": "ios", "created_at": "2022-11-29T17:07:50-05:00", "updated_at": "2022-11-29T17:07:50-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.MobilePlatformApplication.delete({
      session: session,
      id: 1066176056,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/mobile_platform_applications/1066176056.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
