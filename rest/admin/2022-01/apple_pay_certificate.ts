/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {SessionInterface} from '../../../lib/session/types';
import {ApiVersion} from '../../../lib/base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface CsrArgs {
  [key: string]: unknown;
  session: SessionInterface;
  id: number | string;
}

export class ApplePayCertificate extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'apple_pay_certificate';
  protected static PLURAL_NAME = 'apple_pay_certificates';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"},
    {"http_method": "get", "operation": "csr", "ids": ["id"], "path": "apple_pay_certificates/<id>/csr.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "apple_pay_certificates.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "apple_pay_certificates/<id>.json"}
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
    return result ? result[0] : null;
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
