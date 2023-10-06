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
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  since_id?: unknown;
  fields?: unknown;
}
interface CustomizeArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class RecurringApplicationCharge extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "recurring_application_charges/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "recurring_application_charges.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "recurring_application_charges/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "recurring_application_charges.json"},
    {"http_method": "put", "operation": "customize", "ids": ["id"], "path": "recurring_application_charges/<id>/customize.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "recurring_application_charge",
      "plural": "recurring_application_charges"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<RecurringApplicationCharge | null> {
    const result = await this.baseFind<RecurringApplicationCharge>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<RecurringApplicationCharge>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<RecurringApplicationCharge>> {
    const response = await this.baseFind<RecurringApplicationCharge>({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public async customize(
    {
      body = null,
      ...otherArgs
    }: CustomizeArgs
  ): Promise<unknown> {
    const response = await this.request<RecurringApplicationCharge>({
      http_method: "put",
      operation: "customize",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public activated_on: string | null;
  public billing_on: string | null;
  public cancelled_on: string | null;
  public capped_amount: string | number | null;
  public confirmation_url: string | null;
  public created_at: string | null;
  public currency: Currency | null | {[key: string]: any};
  public id: number | null;
  public name: string | null;
  public price: string | number | null;
  public return_url: string | null;
  public status: string | null;
  public terms: string | null;
  public test: boolean | null;
  public trial_days: number | null;
  public trial_ends_on: string | null;
  public updated_at: string | null;
}
