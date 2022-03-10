import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {MobilePlatformApplication} from '../../2022-01';

describe('MobilePlatformApplication resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_applications": [{"id": 1066176004, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-02-03T16:41:51-05:00", "updated_at": "2022-02-03T16:41:51-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}, {"id": 1066176005, "application_id": "com.example", "platform": "android", "created_at": "2022-02-03T16:41:51-05:00", "updated_at": "2022-02-03T16:41:51-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false}]}));

    await MobilePlatformApplication.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_application": {"id": 1066176006, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-02-03T16:41:53-05:00", "updated_at": "2022-02-03T16:41:53-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}}));

    const mobile_platform_application = new MobilePlatformApplication({session: test_session});
    mobile_platform_application.platform = "ios";
    mobile_platform_application.application_id = "X1Y2.ca.domain.app";
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    await mobile_platform_application.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "ios", "application_id": "X1Y2.ca.domain.app", "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_application": {"id": 1066176007, "application_id": "com.example", "platform": "android", "created_at": "2022-02-03T16:41:54-05:00", "updated_at": "2022-02-03T16:41:54-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false}}));

    const mobile_platform_application = new MobilePlatformApplication({session: test_session});
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
      path: '/admin/api/2022-01/mobile_platform_applications.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"platform": "android", "application_id": "com.example", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_application": {"id": 1066176008, "application_id": "X1Y2.ca.domain.app", "platform": "ios", "created_at": "2022-02-03T16:41:54-05:00", "updated_at": "2022-02-03T16:41:54-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true}}));

    await MobilePlatformApplication.find({
      session: test_session,
      id: 1066176008,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications/1066176008.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_application": {"application_id": "A1B2.ca.domain.app", "platform": "ios", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true, "id": 1066176009, "created_at": "2022-02-03T16:41:55-05:00", "updated_at": "2022-02-03T16:41:57-05:00"}}));

    const mobile_platform_application = new MobilePlatformApplication({session: test_session});
    mobile_platform_application.id = 1066176009;
    mobile_platform_application.application_id = "A1B2.ca.domain.app";
    mobile_platform_application.platform = "ios";
    mobile_platform_application.created_at = "2022-02-03T16:41:55-05:00";
    mobile_platform_application.updated_at = "2022-02-03T16:41:55-05:00";
    mobile_platform_application.sha256_cert_fingerprints = [];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = true;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications/1066176009.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"id": 1066176009, "application_id": "A1B2.ca.domain.app", "platform": "ios", "created_at": "2022-02-03T16:41:55-05:00", "updated_at": "2022-02-03T16:41:55-05:00", "sha256_cert_fingerprints": [], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"mobile_platform_application": {"application_id": "com.example.news.app", "platform": "android", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false, "id": 1066176010, "created_at": "2022-02-03T16:41:57-05:00", "updated_at": "2022-02-03T16:41:59-05:00"}}));

    const mobile_platform_application = new MobilePlatformApplication({session: test_session});
    mobile_platform_application.id = 1066176010;
    mobile_platform_application.application_id = "com.example.news.app";
    mobile_platform_application.platform = "android";
    mobile_platform_application.created_at = "2022-02-03T16:41:57-05:00";
    mobile_platform_application.updated_at = "2022-02-03T16:41:57-05:00";
    mobile_platform_application.sha256_cert_fingerprints = [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ];
    mobile_platform_application.enabled_universal_or_app_links = true;
    mobile_platform_application.enabled_shared_webcredentials = false;
    await mobile_platform_application.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications/1066176010.json',
      query: '',
      headers,
      data: { "mobile_platform_application": {"id": 1066176010, "application_id": "com.example.news.app", "platform": "android", "created_at": "2022-02-03T16:41:57-05:00", "updated_at": "2022-02-03T16:41:57-05:00", "sha256_cert_fingerprints": ["14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"], "enabled_universal_or_app_links": true, "enabled_shared_webcredentials": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await MobilePlatformApplication.delete({
      session: test_session,
      id: 1066176011,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/mobile_platform_applications/1066176011.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
