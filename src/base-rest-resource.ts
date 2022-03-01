import {
  HttpResponseError,
  RestResourceError,
  RestResourceRequestError,
} from './error';
import {SessionInterface} from './auth/session/types';
import {RestClient} from './clients/rest';
import {RestRequestReturn} from './clients/rest/types';
import {DataType, GetRequestParams} from './clients/http_client/types';

export interface IdSet {
  [id: string]: string | number | null;
}

export interface ParamSet {
  [key: string]: any;
}

export interface Body {
  [key: string]: any;
}

export interface ResourcePath {
  http_method: string;
  operation: string;
  ids: string[];
  path: string;
}

export interface BaseFindArgs {
  session: SessionInterface;
  params?: ParamSet;
  urlIds: IdSet;
}

export interface RequestArgs extends BaseFindArgs {
  http_method: string;
  operation: string;
  body?: Body | null;
  entity?: Base | null;
}

export interface BaseConstructorArgs {
  session: SessionInterface;
  fromData?: Body | null;
}

interface GetPathArgs {
  http_method: string;
  operation: string;
  urlIds: IdSet;
  entity?: Base | null;
}

class Base {
  // For instance attributes
  [key: string]: any;

  public static NEXT_PAGE_INFO: GetRequestParams | undefined;
  public static PREV_PAGE_INFO: GetRequestParams | undefined;

  protected static NAME = '';
  protected static PLURAL_NAME = '';
  protected static PRIMARY_KEY = 'id';
  protected static CUSTOM_PREFIX: string | null = null;

  protected static HAS_ONE: {[attribute: string]: typeof Base} = {};
  protected static HAS_MANY: {[attribute: string]: typeof Base} = {};

  protected static PATHS: ResourcePath[] = [];

  protected static async baseFind({
    session,
    urlIds,
    params,
  }: BaseFindArgs): Promise<Base[]> {
    const response = await this.request({
      http_method: 'get',
      operation: 'get',
      session,
      urlIds,
      params,
    });

    this.NEXT_PAGE_INFO = response.pageInfo?.nextPage ?? undefined;
    this.PREV_PAGE_INFO = response.pageInfo?.prevPage ?? undefined;

    return this.createInstancesFromResponse(session, response.body as Body);
  }

  protected static async request({
    session,
    http_method,
    operation,
    urlIds,
    params,
    body,
    entity,
  }: RequestArgs): Promise<RestRequestReturn> {
    const client = new RestClient(session.shop, session.accessToken);

    const path = this.getPath({http_method, operation, urlIds, entity});

    const cleanParams: {[key: string]: string | number} = {};
    if (params) {
      for (const key in params) {
        if (params[key] !== null) {
          cleanParams[key] = params[key];
        }
      }
    }

    try {
      switch (http_method) {
        case 'get':
          return await client.get({path, query: cleanParams});
        case 'post':
          return await client.post({
            path,
            query: cleanParams,
            data: body!,
            type: DataType.JSON,
          });
        case 'put':
          return await client.put({
            path,
            query: cleanParams,
            data: body!,
            type: DataType.JSON,
          });
        case 'delete':
          return await client.delete({path, query: cleanParams});
        default:
          throw new Error(`Unrecognized HTTP method "${http_method}"`);
      }
    } catch (error) {
      if (error instanceof HttpResponseError) {
        throw new RestResourceRequestError(
          error.message,
          error.code,
          error.statusText,
        );
      } else {
        throw error;
      }
    }
  }

  protected static getJsonBodyName(): string {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  private static getPath({
    http_method,
    operation,
    urlIds,
    entity,
  }: GetPathArgs): string {
    let match: string | null = null;
    let specificity = -1;

    this.PATHS.forEach((path: ResourcePath) => {
      if (
        http_method !== path.http_method ||
        operation !== path.operation ||
        path.ids.length <= specificity
      ) {
        return;
      }

      let pathUrlIds: IdSet = {...urlIds};
      path.ids.forEach((id) => {
        if (!pathUrlIds[id] && entity && entity[id]) {
          pathUrlIds[id] = entity[id];
        }
      });

      pathUrlIds = Object.entries(pathUrlIds).reduce(
        (acc: IdSet, [key, value]: [string, string | number | null]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      // If we weren't given all of the path's required ids, we can't use it
      const diff = path.ids.reduce(
        (acc: string[], id: string) => (pathUrlIds[id] ? acc : acc.concat(id)),
        [],
      );
      if (diff.length > 0) {
        return;
      }

      specificity = path.ids.length;
      match = path.path.replace(
        /(<([^>]+)>)/g,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (_m1, _m2, id) => `${pathUrlIds[id]}`,
      );
    });

    if (!match) {
      throw new RestResourceError('Could not find a path for request');
    }

    if (this.CUSTOM_PREFIX) {
      return `${this.CUSTOM_PREFIX}/${match}`;
    } else {
      return match;
    }
  }

  private static createInstancesFromResponse(
    session: SessionInterface,
    data: Body,
  ): Base[] {
    if (data[this.PLURAL_NAME]) {
      return data[this.PLURAL_NAME].reduce(
        (acc: Base[], entry: Body) =>
          acc.concat(this.createInstance(session, entry)),
        [],
      );
    }

    if (data[this.NAME]) {
      return [this.createInstance(session, data[this.NAME])];
    }

    return [];
  }

  private static createInstance(
    session: SessionInterface,
    data: Body,
    prevInstance?: Base,
  ): Base {
    const instance: Base = prevInstance
      ? prevInstance
      : new (this as any)({session});

    if (data) {
      instance.setData(data);
    }

    return instance;
  }

  public session: SessionInterface;

  constructor({session, fromData}: BaseConstructorArgs) {
    this.session = session;

    if (fromData) {
      this.setData(fromData);
    }
  }

  public async save({update = false} = {}): Promise<void> {
    const {PRIMARY_KEY, NAME} = this.resource();
    const method = this[PRIMARY_KEY] ? 'put' : 'post';

    const data = this.serialize();

    const response = await this.resource().request({
      http_method: method,
      operation: method,
      session: this.session,
      urlIds: {},
      body: {[this.resource().getJsonBodyName()]: data},
      entity: this,
    });

    const body: Body | undefined = (response.body as Body)[NAME];

    if (update && body) {
      this.setData(body);
    }
  }

  public async saveAndUpdate(): Promise<void> {
    await this.save({update: true});
  }

  public async delete(): Promise<void> {
    await this.resource().request({
      http_method: 'delete',
      operation: 'delete',
      session: this.session,
      urlIds: {},
      entity: this,
    });
  }

  public serialize(): Body {
    const {HAS_MANY, HAS_ONE} = this.resource();

    return Object.entries(this).reduce((acc: Body, [attribute, value]) => {
      if (['session'].includes(attribute)) {
        return acc;
      }

      if (attribute in HAS_MANY && value) {
        acc[attribute] = value.reduce(
          (attrAcc: Body, entry: Base) =>
            attrAcc.concat(entry.serialize ? entry.serialize() : entry),
          [],
        );
      } else if (attribute in HAS_ONE && value && value.serialize) {
        acc[attribute] = (value as Base).serialize();
      } else {
        acc[attribute] = value;
      }

      return acc;
    }, {});
  }

  protected setData(data: Body): void {
    const {HAS_MANY, HAS_ONE} = this.resource();

    Object.entries(data).forEach(([attribute, val]) => {
      if (attribute in HAS_MANY) {
        const HasManyResource: typeof Base = HAS_MANY[attribute];
        this[attribute] = [];
        val.forEach((entry: Body) => {
          this[attribute].push(
            new HasManyResource({session: this.session, fromData: entry}),
          );
        });
      } else if (attribute in HAS_ONE) {
        const HasOneResource: typeof Base = HAS_ONE[attribute];
        this[attribute] = new HasOneResource({
          session: this.session,
          fromData: val,
        });
      } else {
        this[attribute] = val;
      }
    });
  }

  private resource(): typeof Base {
    return this.constructor as unknown as typeof Base;
  }
}

export default Base;
