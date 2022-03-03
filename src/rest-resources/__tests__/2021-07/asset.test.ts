import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Asset} from '../../2021-07';

describe('Asset resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Asset.all({
      session: test_session,
      theme_id: 828155753,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const asset = new Asset({session: test_session});
    asset.theme_id = 828155753;
    asset.key = "templates/index.liquid";
    asset.value = "<img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p>";
    await asset.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: '',
      headers,
      data: { "asset": {key: "templates/index.liquid", value: "<img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p>"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const asset = new Asset({session: test_session});
    asset.theme_id = 828155753;
    asset.key = "assets/empty.gif";
    asset.attachment = "R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==\n";
    await asset.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: '',
      headers,
      data: { "asset": {key: "assets/empty.gif", attachment: "R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==\n"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const asset = new Asset({session: test_session});
    asset.theme_id = 828155753;
    asset.key = "assets/bg-body.gif";
    asset.src = "http://apple.com/new_bg.gif";
    await asset.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: '',
      headers,
      data: { "asset": {key: "assets/bg-body.gif", src: "http://apple.com/new_bg.gif"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const asset = new Asset({session: test_session});
    asset.theme_id = 828155753;
    asset.key = "layout/alternate.liquid";
    asset.source_key = "layout/theme.liquid";
    await asset.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: '',
      headers,
      data: { "asset": {key: "layout/alternate.liquid", source_key: "layout/theme.liquid"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Asset.all({
      session: test_session,
      theme_id: 828155753,
      asset: {key: "templates/index.liquid"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: 'asset%5Bkey%5D=templates%2Findex.liquid',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Asset.delete({
      session: test_session,
      theme_id: 828155753,
      asset: {key: "assets/bg-body.gif"},
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/themes/828155753/assets.json',
      query: 'asset%5Bkey%5D=assets%2Fbg-body.gif',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
