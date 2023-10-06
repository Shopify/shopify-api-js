/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface CsrArgs {
  [key: string]: unknown;
  session: Session;
  id: number | string;
}

export class ApplePayCertificate extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"},
    {"http_method": "get", "operation": "csr", "ids": ["id"], "path": "apple_pay_certificates/<id>/csr.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "apple_pay_certificates.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "apple_pay_certificate",
      "plural": "apple_pay_certificates"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<ApplePayCertificate | null> {
    const result = await this.baseFind<ApplePayCertificate>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<ApplePayCertificate>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async csr(
    {
      session,
      id,
      ...otherArgs
    }: CsrArgs
  ): Promise<unknown> {
    const response = await this.request<ApplePayCertificate>({
      http_method: "get",
      operation: "csr",
      session: session,
      urlIds: {"id": id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public id: number | null;
  public merchant_id: string | null;
  public status: string | null;
}
