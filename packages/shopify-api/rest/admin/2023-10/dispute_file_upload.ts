/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface DeleteArgs {
  session: Session;
  id: number | string;
  dispute_id?: number | string | null;
}

export class DisputeFileUpload extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["dispute_id", "id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_file_uploads/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["dispute_id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_file_uploads.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "dispute_file_upload",
      "plural": "dispute_file_uploads"
    }
  ];

  public static async delete(
    {
      session,
      id,
      dispute_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<DisputeFileUpload>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "dispute_id": dispute_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public dispute_evidence_id: number | null;
  public dispute_evidence_type: string | null;
  public file_size: number | null;
  public file_type: string | null;
  public filename: string | null;
  public id: number | null;
  public original_filename: string | null;
  public shop_id: number | null;
  public url: string | null;
}
