/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
  dispute_id?: number | string | null;
}

export class DisputeFileUpload extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'dispute_file_upload';
  protected static PLURAL_NAME = 'dispute_file_uploads';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["dispute_id", "id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_file_uploads/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["dispute_id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_file_uploads.json"}
  ];

  public static async delete(
    {
      session,
      id,
      dispute_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await DisputeFileUpload.request({
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
