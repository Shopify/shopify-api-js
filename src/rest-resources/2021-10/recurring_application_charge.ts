import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  since_id?: unknown;
  fields?: unknown;
}
interface CustomizeArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class RecurringApplicationCharge extends Base {
  public static API_VERSION = ApiVersion.October21;

  protected static NAME = 'recurring_application_charge';
  protected static PLURAL_NAME = 'recurring_application_charges';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "post", "operation": "post", "ids": [], "path": "recurring_application_charges.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "recurring_application_charges.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "recurring_application_charges/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "recurring_application_charges/<id>.json"},
    {"http_method": "put", "operation": "customize", "ids": ["id"], "path": "recurring_application_charges/<id>/customize.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<RecurringApplicationCharge | null> {
    const result = await RecurringApplicationCharge.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as RecurringApplicationCharge : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await RecurringApplicationCharge.request({
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
  ): Promise<RecurringApplicationCharge[]> {
    const response = await RecurringApplicationCharge.baseFind({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as RecurringApplicationCharge[];
  }

  public async customize(
    {
      body = null,
      ...otherArgs
    }: CustomizeArgs
  ): Promise<unknown> {
    const response = await RecurringApplicationCharge.request({
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
