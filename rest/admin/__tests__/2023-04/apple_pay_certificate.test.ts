/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
=======

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April23,
    restResources,
  });
});

describe('ApplePayCertificate resource', () => {
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
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
    queueMockResponse(JSON.stringify({"apple_pay_certificate": {"id": 1068938274, "status": "issuing", "merchant_id": null}}));
=======
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938274, "status": "issuing", "merchant_id": null}}));
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts

    const apple_pay_certificate = new shopify.rest.ApplePayCertificate({session: session});

    await apple_pay_certificate.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/apple_pay_certificates.json',
      query: '',
      headers,
      data: { "apple_pay_certificate": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
    queueMockResponse(JSON.stringify({"apple_pay_certificate": {"id": 1068938276, "status": "csr", "merchant_id": null}}));

    await shopify.rest.ApplePayCertificate.find({
      session: session,
=======
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938276, "status": "csr", "merchant_id": null}}));

    await ApplePayCertificate.find({
      session: test_session,
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      id: 1068938276,
    });

    expect({
      method: 'GET',
      domain,
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
      path: '/admin/api/2023-04/apple_pay_certificates/1068938276.json',
=======
      path: '/admin/api/2022-01/apple_pay_certificates/1068938276.json',
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
    queueMockResponse(JSON.stringify({"apple_pay_certificate": {"id": 1068938278, "status": "completed", "merchant_id": "merchant.something"}}));

    const apple_pay_certificate = new shopify.rest.ApplePayCertificate({session: session});
    apple_pay_certificate.id = 1068938278;
=======
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938277, "status": "completed", "merchant_id": "merchant.something"}}));

    const apple_pay_certificate = new ApplePayCertificate({session: test_session});
    apple_pay_certificate.id = 1068938277;
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
    apple_pay_certificate.status = "completed";
    apple_pay_certificate.merchant_id = "merchant.something";
    apple_pay_certificate.encoded_signed_certificate = "MIIEZzCCBA6gAwIBAgIIWGMideLkDJAwCgYIKoZIzj0EAwIwgYAxNDAyBgNV\nBAMMK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0g\nRzIxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMw\nEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0xNDEyMDgyMTMy\nMDBaFw0xNzAxMDYyMTMyMDBaMIGZMSowKAYKCZImiZPyLGQBAQwabWVyY2hh\nbnQuY29tLm5vcm1vcmUuamFzb24xMDAuBgNVBAMMJ01lcmNoYW50IElEOiBt\nZXJjaGFudC5jb20ubm9ybW9yZS5qYXNvbjETMBEGA1UECwwKNVVZMzJOTE5O\nOTEXMBUGA1UECgwOSm9zaHVhIFRlc3NpZXIxCzAJBgNVBAYTAkNBMFkwEwYH\nKoZIzj0CAQYIKoZIzj0DAQcDQgAEAxDDCvzG6MnsZSJOtbr0hr3MRq+4HzTZ\nx8J4FD34E3kU5CallEnZLBmnzfqmjP8644SO28LLJxvWBnrg7lHFtaOCAlUw\nggJRMEcGCCsGAQUFBwEBBDswOTA3BggrBgEFBQcwAYYraHR0cDovL29jc3Au\nYXBwbGUuY29tL29jc3AwNC1hcHBsZXd3ZHJjYTIwMTAdBgNVHQ4EFgQUkPsO\nKEKvhL/takKomy5GWXtCd8wwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBSE\ntoTMOoZichZZlOgao71I3zrfCzCCAR0GA1UdIASCARQwggEQMIIBDAYJKoZI\nhvdjZAUBMIH+MIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMg\nY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBv\nZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25k\naXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZp\nY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDYGCCsGAQUFBwIBFipodHRw\nOi8vd3d3LmFwcGxlLmNvbS9jZXJ0aWZpY2F0ZWF1dGhvcml0eS8wNgYDVR0f\nBC8wLTAroCmgJ4YlaHR0cDovL2NybC5hcHBsZS5jb20vYXBwbGV3d2RyY2Ey\nLmNybDAOBgNVHQ8BAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDM0NTBBMjhB\nOTlGRjIyRkI5OTdDRERFODU1REREOTI5NTE4RjVGMDdBQUM4NzdDMzRCQjM3\nODFCQTg2MzkyNjIwCgYIKoZIzj0EAwIDRwAwRAIgZ/oNx0gCc/PM4pYhOWL2\nCecFQrIgzHr/fZd8qcy3Be8CIEQCaAPpmvQrXEX0hFexoYMHtOHY9dgN2D8L\nNKpVyn3t\n";
    await apple_pay_certificate.save({});

    expect({
      method: 'PUT',
      domain,
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
      path: '/admin/api/2023-04/apple_pay_certificates/1068938278.json',
=======
      path: '/admin/api/2022-01/apple_pay_certificates/1068938277.json',
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      query: '',
      headers,
      data: { "apple_pay_certificate": {"status": "completed", "merchant_id": "merchant.something", "encoded_signed_certificate": "MIIEZzCCBA6gAwIBAgIIWGMideLkDJAwCgYIKoZIzj0EAwIwgYAxNDAyBgNV\nBAMMK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0g\nRzIxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMw\nEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0xNDEyMDgyMTMy\nMDBaFw0xNzAxMDYyMTMyMDBaMIGZMSowKAYKCZImiZPyLGQBAQwabWVyY2hh\nbnQuY29tLm5vcm1vcmUuamFzb24xMDAuBgNVBAMMJ01lcmNoYW50IElEOiBt\nZXJjaGFudC5jb20ubm9ybW9yZS5qYXNvbjETMBEGA1UECwwKNVVZMzJOTE5O\nOTEXMBUGA1UECgwOSm9zaHVhIFRlc3NpZXIxCzAJBgNVBAYTAkNBMFkwEwYH\nKoZIzj0CAQYIKoZIzj0DAQcDQgAEAxDDCvzG6MnsZSJOtbr0hr3MRq+4HzTZ\nx8J4FD34E3kU5CallEnZLBmnzfqmjP8644SO28LLJxvWBnrg7lHFtaOCAlUw\nggJRMEcGCCsGAQUFBwEBBDswOTA3BggrBgEFBQcwAYYraHR0cDovL29jc3Au\nYXBwbGUuY29tL29jc3AwNC1hcHBsZXd3ZHJjYTIwMTAdBgNVHQ4EFgQUkPsO\nKEKvhL/takKomy5GWXtCd8wwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBSE\ntoTMOoZichZZlOgao71I3zrfCzCCAR0GA1UdIASCARQwggEQMIIBDAYJKoZI\nhvdjZAUBMIH+MIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMg\nY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBv\nZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25k\naXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZp\nY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDYGCCsGAQUFBwIBFipodHRw\nOi8vd3d3LmFwcGxlLmNvbS9jZXJ0aWZpY2F0ZWF1dGhvcml0eS8wNgYDVR0f\nBC8wLTAroCmgJ4YlaHR0cDovL2NybC5hcHBsZS5jb20vYXBwbGV3d2RyY2Ey\nLmNybDAOBgNVHQ8BAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDM0NTBBMjhB\nOTlGRjIyRkI5OTdDRERFODU1REREOTI5NTE4RjVGMDdBQUM4NzdDMzRCQjM3\nODFCQTg2MzkyNjIwCgYIKoZIzj0EAwIDRwAwRAIgZ/oNx0gCc/PM4pYhOWL2\nCecFQrIgzHr/fZd8qcy3Be8CIEQCaAPpmvQrXEX0hFexoYMHtOHY9dgN2D8L\nNKpVyn3t\n"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({}));

<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
    await shopify.rest.ApplePayCertificate.delete({
      session: session,
      id: 1068938277,
=======
    await ApplePayCertificate.delete({
      session: test_session,
      id: 1068938278,
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
    });

    expect({
      method: 'DELETE',
      domain,
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
      path: '/admin/api/2023-04/apple_pay_certificates/1068938277.json',
=======
      path: '/admin/api/2022-01/apple_pay_certificates/1068938278.json',
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"csr": {"key": "YXBwbGUtcGF5LWNzcg==\n"}}));

<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
    await shopify.rest.ApplePayCertificate.csr({
      session: session,
=======
    await ApplePayCertificate.csr({
      session: test_session,
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      id: 1068938275,
    });

    expect({
      method: 'GET',
      domain,
<<<<<<< HEAD:rest/admin/__tests__/2023-04/apple_pay_certificate.test.ts
      path: '/admin/api/2023-04/apple_pay_certificates/1068938275/csr.json',
=======
      path: '/admin/api/2022-01/apple_pay_certificates/1068938275/csr.json',
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/__tests__/2022-01/apple_pay_certificate.test.ts
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
