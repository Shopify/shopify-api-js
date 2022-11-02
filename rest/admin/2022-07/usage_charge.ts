/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
  recurring_application_charge_id?: number | string | null;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  recurring_application_charge_id?: number | string | null;
  fields?: unknown;
}

export class UsageCharge extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'usage_charge';
  protected static PLURAL_NAME = 'usage_charges';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["recurring_application_charge_id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges.json"},
    {"http_method": "get", "operation": "get", "ids": ["recurring_application_charge_id", "id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["recurring_application_charge_id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges.json"}
  ];

  public static async find(
    {
      session,
      id,
      recurring_application_charge_id = null,
      fields = null
    }: FindArgs
  ): Promise<UsageCharge | null> {
    const result = await this.baseFind<UsageCharge>({
      session: session,
      urlIds: {"id": id, "recurring_application_charge_id": recurring_application_charge_id},
      params: {"fields": fields},
    });
    return result ? result[0] : null;
  }

  public static async all(
    {
      session,
      recurring_application_charge_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<UsageCharge[]> {
    const response = await this.baseFind<UsageCharge>({
      session: session,
      urlIds: {"recurring_application_charge_id": recurring_application_charge_id},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public created_at: string | null;
  public description: string | null;
  public id: number | null;
  public price: number | null;
  public recurring_application_charge_id: number | null;
  public updated_at: string | null;
}
