/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  since_id?: unknown;
  fields?: unknown;
}

export class ApplicationCharge extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'application_charge';
  protected static PLURAL_NAME = 'application_charges';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "application_charges.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "application_charges/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "application_charges.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<ApplicationCharge | null> {
    const result = await ApplicationCharge.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as ApplicationCharge : null;
  }

  public static async all(
    {
      session,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<ApplicationCharge[]> {
    const response = await ApplicationCharge.baseFind({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as ApplicationCharge[];
  }

  public confirmation_url: string | null;
  public created_at: string | null;
  public id: number | null;
  public name: string | null;
  public price: string | number | null;
  public return_url: string | null;
  public status: string | null;
  public test: boolean | null;
  public updated_at: string | null;
}
