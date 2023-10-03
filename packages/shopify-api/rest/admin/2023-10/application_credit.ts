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
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  fields?: unknown;
}

export class ApplicationCredit extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "application_credits.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "application_credits/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "application_credit",
      "plural": "application_credits"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<ApplicationCredit | null> {
    const result = await this.baseFind<ApplicationCredit>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<ApplicationCredit>> {
    const response = await this.baseFind<ApplicationCredit>({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public amount: string | null;
  public currency: Currency | null | {[key: string]: any};
  public description: string | null;
  public id: number | null;
  public test: boolean | null;
}
