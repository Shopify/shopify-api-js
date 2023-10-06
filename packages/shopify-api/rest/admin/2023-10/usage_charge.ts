/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Currency} from './currency';

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
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["recurring_application_charge_id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges.json"},
    {"http_method": "get", "operation": "get", "ids": ["recurring_application_charge_id", "id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["recurring_application_charge_id"], "path": "recurring_application_charges/<recurring_application_charge_id>/usage_charges.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "usage_charge",
      "plural": "usage_charges"
    }
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
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      recurring_application_charge_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<UsageCharge>> {
    const response = await this.baseFind<UsageCharge>({
      session: session,
      urlIds: {"recurring_application_charge_id": recurring_application_charge_id},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public created_at: string | null;
  public currency: Currency | null | {[key: string]: any};
  public description: string | null;
  public id: number | null;
  public price: string | null;
  public recurring_application_charge_id: number | null;
  public updated_at: string | null;
}
