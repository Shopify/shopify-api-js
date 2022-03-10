import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class Balance extends Base {
  public static API_VERSION = ApiVersion.July21;

  protected static NAME = 'balance';
  protected static PLURAL_NAME = 'balances';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/balance.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<Balance[]> {
    const response = await Balance.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as Balance[];
  }

}
