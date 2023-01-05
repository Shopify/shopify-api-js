import {Base} from '../../../../../rest/base';
import {ResourcePath} from '../../../../../rest/types';
import {Session} from '../../../../session/session';
import {LATEST_API_VERSION} from '../../../../types';

interface FakeResourceWithCustomPrefixFindArgs {
  session: Session;
  id: string | number;
}

export class FakeResourceWithCustomPrefix extends Base {
  public static API_VERSION = LATEST_API_VERSION;
  protected static NAME = 'fake_resource_with_custom_prefix';
  protected static PLURAL_NAME = 'fake_resource_with_custom_prefixes';
  protected static CUSTOM_PREFIX = '/admin/custom_prefix';

  protected static HAS_ONE = {};
  protected static HAS_MANY = {};

  protected static PATHS: ResourcePath[] = [
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
    return result ? result[0] : null;
  }

  id?: number | string | null;
  attribute?: string | null;
}
