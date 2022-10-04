/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ApplePayCertificate} from '../../2022-04';

describe('ApplePayCertificate resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938274, "status": "issuing", "merchant_id": null}}));

    const apple_pay_certificate = new ApplePayCertificate({session: test_session});

    await apple_pay_certificate.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/apple_pay_certificates.json',
      query: '',
      headers,
      data: { "apple_pay_certificate": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938276, "status": "csr", "merchant_id": null}}));

    await ApplePayCertificate.find({
      session: test_session,
      id: 1068938276,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/apple_pay_certificates/1068938276.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"apple_pay_certificate": {"id": 1068938277, "status": "completed", "merchant_id": "merchant.something"}}));

    const apple_pay_certificate = new ApplePayCertificate({session: test_session});
    apple_pay_certificate.id = 1068938277;
    apple_pay_certificate.status = "completed";
    apple_pay_certificate.merchant_id = "merchant.something";
    apple_pay_certificate.encoded_signed_certificate = "MIIEZzCCBA6gAwIBAgIIWGMideLkDJAwCgYIKoZIzj0EAwIwgYAxNDAyBgNV\nBAMMK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0g\nRzIxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMw\nEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0xNDEyMDgyMTMy\nMDBaFw0xNzAxMDYyMTMyMDBaMIGZMSowKAYKCZImiZPyLGQBAQwabWVyY2hh\nbnQuY29tLm5vcm1vcmUuamFzb24xMDAuBgNVBAMMJ01lcmNoYW50IElEOiBt\nZXJjaGFudC5jb20ubm9ybW9yZS5qYXNvbjETMBEGA1UECwwKNVVZMzJOTE5O\nOTEXMBUGA1UECgwOSm9zaHVhIFRlc3NpZXIxCzAJBgNVBAYTAkNBMFkwEwYH\nKoZIzj0CAQYIKoZIzj0DAQcDQgAEAxDDCvzG6MnsZSJOtbr0hr3MRq+4HzTZ\nx8J4FD34E3kU5CallEnZLBmnzfqmjP8644SO28LLJxvWBnrg7lHFtaOCAlUw\nggJRMEcGCCsGAQUFBwEBBDswOTA3BggrBgEFBQcwAYYraHR0cDovL29jc3Au\nYXBwbGUuY29tL29jc3AwNC1hcHBsZXd3ZHJjYTIwMTAdBgNVHQ4EFgQUkPsO\nKEKvhL/takKomy5GWXtCd8wwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBSE\ntoTMOoZichZZlOgao71I3zrfCzCCAR0GA1UdIASCARQwggEQMIIBDAYJKoZI\nhvdjZAUBMIH+MIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMg\nY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBv\nZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25k\naXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZp\nY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDYGCCsGAQUFBwIBFipodHRw\nOi8vd3d3LmFwcGxlLmNvbS9jZXJ0aWZpY2F0ZWF1dGhvcml0eS8wNgYDVR0f\nBC8wLTAroCmgJ4YlaHR0cDovL2NybC5hcHBsZS5jb20vYXBwbGV3d2RyY2Ey\nLmNybDAOBgNVHQ8BAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDM0NTBBMjhB\nOTlGRjIyRkI5OTdDRERFODU1REREOTI5NTE4RjVGMDdBQUM4NzdDMzRCQjM3\nODFCQTg2MzkyNjIwCgYIKoZIzj0EAwIDRwAwRAIgZ/oNx0gCc/PM4pYhOWL2\nCecFQrIgzHr/fZd8qcy3Be8CIEQCaAPpmvQrXEX0hFexoYMHtOHY9dgN2D8L\nNKpVyn3t\n";
    await apple_pay_certificate.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/apple_pay_certificates/1068938277.json',
      query: '',
      headers,
      data: { "apple_pay_certificate": {"status": "completed", "merchant_id": "merchant.something", "encoded_signed_certificate": "MIIEZzCCBA6gAwIBAgIIWGMideLkDJAwCgYIKoZIzj0EAwIwgYAxNDAyBgNV\nBAMMK0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zIENBIC0g\nRzIxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMw\nEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzAeFw0xNDEyMDgyMTMy\nMDBaFw0xNzAxMDYyMTMyMDBaMIGZMSowKAYKCZImiZPyLGQBAQwabWVyY2hh\nbnQuY29tLm5vcm1vcmUuamFzb24xMDAuBgNVBAMMJ01lcmNoYW50IElEOiBt\nZXJjaGFudC5jb20ubm9ybW9yZS5qYXNvbjETMBEGA1UECwwKNVVZMzJOTE5O\nOTEXMBUGA1UECgwOSm9zaHVhIFRlc3NpZXIxCzAJBgNVBAYTAkNBMFkwEwYH\nKoZIzj0CAQYIKoZIzj0DAQcDQgAEAxDDCvzG6MnsZSJOtbr0hr3MRq+4HzTZ\nx8J4FD34E3kU5CallEnZLBmnzfqmjP8644SO28LLJxvWBnrg7lHFtaOCAlUw\nggJRMEcGCCsGAQUFBwEBBDswOTA3BggrBgEFBQcwAYYraHR0cDovL29jc3Au\nYXBwbGUuY29tL29jc3AwNC1hcHBsZXd3ZHJjYTIwMTAdBgNVHQ4EFgQUkPsO\nKEKvhL/takKomy5GWXtCd8wwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBSE\ntoTMOoZichZZlOgao71I3zrfCzCCAR0GA1UdIASCARQwggEQMIIBDAYJKoZI\nhvdjZAUBMIH+MIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMg\nY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBv\nZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25k\naXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZp\nY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDYGCCsGAQUFBwIBFipodHRw\nOi8vd3d3LmFwcGxlLmNvbS9jZXJ0aWZpY2F0ZWF1dGhvcml0eS8wNgYDVR0f\nBC8wLTAroCmgJ4YlaHR0cDovL2NybC5hcHBsZS5jb20vYXBwbGV3d2RyY2Ey\nLmNybDAOBgNVHQ8BAf8EBAMCAygwTwYJKoZIhvdjZAYgBEIMQDM0NTBBMjhB\nOTlGRjIyRkI5OTdDRERFODU1REREOTI5NTE4RjVGMDdBQUM4NzdDMzRCQjM3\nODFCQTg2MzkyNjIwCgYIKoZIzj0EAwIDRwAwRAIgZ/oNx0gCc/PM4pYhOWL2\nCecFQrIgzHr/fZd8qcy3Be8CIEQCaAPpmvQrXEX0hFexoYMHtOHY9dgN2D8L\nNKpVyn3t\n"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ApplePayCertificate.delete({
      session: test_session,
      id: 1068938278,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/apple_pay_certificates/1068938278.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"csr": {"key": "YXBwbGUtcGF5LWNzcg==\n"}}));

    await ApplePayCertificate.csr({
      session: test_session,
      id: 1068938275,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/apple_pay_certificates/1068938275/csr.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
