import {Base} from '../../../../../rest/base';
import {ResourceNames, ResourcePath} from '../../../../../rest/types';
import {Session} from '../../../../session/session';
import {LATEST_API_VERSION} from '../../../../types';

interface FakeResourceWithCustomPrefixFindArgs {
  session: Session;
  id: string | number;
}

export class FakeResourceWithCustomPrefix extends Base {
  public static apiVersion = LATEST_API_VERSION;
  protected static resourceNames: ResourceNames[] = [
    {
      singular: 'fake_resource_with_custom_prefix',
      plural: 'fake_resources_with_custom_prefixes',
    },
  ];

  protected static customPrefix = '/admin/custom_prefix';

  protected static hasOne = {};
  protected static hasMany = {};

  protected static paths: ResourcePath[] = [
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id'],
      path: 'fake_resource_with_custom_prefix/<id>.json',
    },
  ];

  public static async find({
    session,
    id,
  }: FakeResourceWithCustomPrefixFindArgs): Promise<FakeResourceWithCustomPrefix | null> {
    const result = await this.baseFind<FakeResourceWithCustomPrefix>({
      session,
      urlIds: {id},
    });
    return result.data ? result.data[0] : null;
  }

  id?: number | string | null;
  attribute?: string | null;
}
