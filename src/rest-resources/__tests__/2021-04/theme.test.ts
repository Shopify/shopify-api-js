import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Theme} from '../../2021-04';

describe('Theme resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Theme.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/themes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const theme = new Theme({session: test_session});
    theme.name = "Lemongrass";
    theme.src = "http://themes.shopify.com/theme.zip";
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/themes.json',
      query: '',
      headers,
      data: { "theme": {name: "Lemongrass", src: "http://themes.shopify.com/theme.zip", role: "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Theme.find({
      session: test_session,
      id: 828155753,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/themes/828155753.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const theme = new Theme({session: test_session});
    theme.id = 752253240;
    theme.name = "Experimental";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-04/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {id: 752253240, name: "Experimental"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const theme = new Theme({session: test_session});
    theme.id = 752253240;
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-04/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {id: 752253240, role: "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Theme.delete({
      session: test_session,
      id: 752253240,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-04/themes/752253240.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
