import Base, {ResourcePath} from '../base-rest-resource';
import {SessionInterface} from '../auth/session/types';

interface FakeResourceWithCustomPrefixFindArgs {
  session: SessionInterface;
  id: string | number;
}

export default class FakeResourceWithCustomPrefix extends Base {
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

  public static find = async ({
    session,
    id,
  }: FakeResourceWithCustomPrefixFindArgs): Promise<FakeResourceWithCustomPrefix | null> => {
    const result = await FakeResourceWithCustomPrefix.baseFind({
      session,
      urlIds: {id},
    });
    return result ? (result[0] as FakeResourceWithCustomPrefix) : null;
  };

  id?: number | string | null;
  attribute?: string | null;
}
