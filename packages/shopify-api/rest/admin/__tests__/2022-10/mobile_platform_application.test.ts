/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_applications": [{"id": 1066175998, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2023-10-03T13:23:49-04:00", "updated_at": "2023-10-03T13:23:49-04:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "enabled_app_clips": false, "app_clip_application_id": null}, {"id": 1066175999, "application_id": "com.example", "platform": "android", "created_at": "2023-10-03T13:23:49-04:00", "updated_at": "2023-10-03T13:23:49-04:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "enabled_app_clips": false, "app_clip_application_id": null}]}));

    await shopify.rest.MobilePlatformApplication.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066175996, "application_id": "com.example", "platform": "android", "created_at": "2023-10-03T13:23:48-04:00", "updated_at": "2023-10-03T13:23:48-04:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "enabled_app_clips": false, "app_clip_application_id": null}}));

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
      path: '/admin/api/2022-10/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "android", "application_id": "com.example", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066176002, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2023-10-03T13:23:51-04:00", "updated_at": "2023-10-03T13:23:51-04:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "enabled_app_clips": false, "app_clip_application_id": null}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.platform = "ios";
    mobile_platform_application.application_id = "X1Y2.ca.domain.app";
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    await mobile_platform_application.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "ios", "application_id": "X1Y2.ca.domain.app", "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_application": {"id": 1066176000, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2023-10-03T13:23:49-04:00", "updated_at": "2023-10-03T13:23:49-04:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "enabled_app_clips": false, "app_clip_application_id": null}}));

    await shopify.rest.MobilePlatformApplication.find({
      session: session,
      id: 1066176000,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications/1066176000.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_application": {"application_id": "com.example.news.app", "platform": "android", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "id": 1066176003, "created_at": "2023-10-03T13:23:52-04:00", "updated_at": "2023-10-03T13:23:52-04:00", "enabled_app_clips": false, "app_clip_application_id": null}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.id = 1066176003;
    mobile_platform_application.application_id = "com.example.news.app";
    mobile_platform_application.platform = "android";
    mobile_platform_application.created_at = "2023-10-03T13:23:52-04:00";
    mobile_platform_application.updated_at = "2023-10-03T13:23:52-04:00";
    mobile_platform_application.sha256_cert_fingerprints = [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = false;
    mobile_platform_application.enabled_app_clips = false;
    mobile_platform_application.app_clip_application_id = null;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications/1066176003.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"application_id": "com.example.news.app", "platform": "android", "created_at": "2023-10-03T13:23:52-04:00", "updated_at": "2023-10-03T13:23:52-04:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "enabled_app_clips": false, "app_clip_application_id": null} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"mobile_platform_application": {"application_id": "A1B2.ca.domain.app", "platform": "ios", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "id": 1066175997, "created_at": "2023-10-03T13:23:48-04:00", "updated_at": "2023-10-03T13:23:49-04:00", "enabled_app_clips": false, "app_clip_application_id": null}}));

    const mobile_platform_application = new shopify.rest.MobilePlatformApplication({session: session});
    mobile_platform_application.id = 1066175997;
    mobile_platform_application.application_id = "A1B2.ca.domain.app";
    mobile_platform_application.platform = "ios";
    mobile_platform_application.created_at = "2023-10-03T13:23:48-04:00";
    mobile_platform_application.updated_at = "2023-10-03T13:23:48-04:00";
    mobile_platform_application.sha256_cert_fingerprints = [];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    mobile_platform_application.enabled_app_clips = false;
    mobile_platform_application.app_clip_application_id = null;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications/1066175997.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"application_id": "A1B2.ca.domain.app", "platform": "ios", "created_at": "2023-10-03T13:23:48-04:00", "updated_at": "2023-10-03T13:23:48-04:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "enabled_app_clips": false, "app_clip_application_id": null} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.MobilePlatformApplication.delete({
      session: session,
      id: 1066176001,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/mobile_platform_applications/1066176001.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
