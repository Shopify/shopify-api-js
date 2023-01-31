import {Base} from '../../../../../rest/base';
import {ResourcePath} from '../../../../../rest/types';
import {Session} from '../../../../session/session';
import {LATEST_API_VERSION} from '../../../../types';

interface FakeResourceFindArgs {
  param?: string | null;
  session: Session;
  id: number;
  other_resource_id?: number | null;
}

interface FakeResourceAllArgs {
  param?: string | null;
  session: Session;
}

interface FakeResourceCustomArgs {
  session: Session;
  id: number;
  other_resource_id: number;
}

export class FakeResource extends Base {
  public static API_VERSION = LATEST_API_VERSION;
  protected static NAME = 'fake_resource';
  protected static PLURAL_NAME = 'fake_resources';

  protected static READ_ONLY_ATTRIBUTES: string[] = ['unsaveable_attribute'];

  protected static HAS_ONE = {
    has_one_attribute: this,
  };

  protected static HAS_MANY = {
    has_many_attribute: this,
  };

  protected static PATHS: ResourcePath[] = [
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'get',
      ids: [],
      path: 'fake_resources.json',
    },
    {
      http_method: 'post',
      operation: 'post',
      ids: [],
      path: 'fake_resources.json',
    },
    {
      http_method: 'put',
      operation: 'put',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'delete',
      operation: 'delete',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'custom',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>/custom.json',
    },
    {
      http_method: 'delete',
      operation: 'delete',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>.json',
    },
  ];

  public static async find({
    session,
    id,
    other_resource_id = null,
    param = null,
    ...otherArgs
  }: FakeResourceFindArgs): Promise<FakeResource | null> {
    const result = await this.baseFind<FakeResource>({
      session,
      urlIds: {id, other_resource_id},
      params: {param, ...otherArgs},
    });
    return result ? result[0] : null;
  }

  public static async all({
    session,
    param = null,
    ...otherArgs
  }: FakeResourceAllArgs): Promise<FakeResource[]> {
    return this.baseFind<FakeResource>({
      session,
      urlIds: {},
      params: {param, ...otherArgs},
    });
  }

  public static async custom({
    session,
    id,
    other_resource_id,
  }: FakeResourceCustomArgs): Promise<Body> {
    const response = await this.request<Body>({
      http_method: 'get',
      operation: 'custom',
      session,
      urlIds: {id, other_resource_id},
    });

    return response.body;
  }

  id?: number | string | null;
  attribute?: string | null;
  has_one_attribute?: FakeResource | null;
  has_many_attribute?: FakeResource[] | null;
  other_resource_id?: number | null;
}
