/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2022-07/application_charge.ts
import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Currency} from './currency';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-01/application_charge.ts

interface FindArgs {
  session: Session;
  id: number | string;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  since_id?: unknown;
  fields?: unknown;
}

export class ApplicationCharge extends Base {
  public static apiVersion = ApiVersion.July22;

  protected static resourceName = 'application_charge';
  protected static pluralName = 'application_charges';
  protected static hasOne: {[key: string]: typeof Base} = {
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
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
    const result = await this.baseFind<ApplicationCharge>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<ApplicationCharge>> {
    const response = await this.baseFind<ApplicationCharge>({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public confirmation_url: string | null;
  public created_at: string | null;
  public currency: Currency | null | {[key: string]: any};
  public id: number | null;
  public name: string | null;
  public price: string | number | null;
  public return_url: string | null;
  public status: string | null;
  public test: boolean | null;
  public updated_at: string | null;
}
