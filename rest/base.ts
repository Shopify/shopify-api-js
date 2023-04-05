import {RestResourceError} from '../lib/error';
import {Session} from '../lib/session/session';
import {PageInfo, RestRequestReturn} from '../lib/clients/rest/types';
import {DataType} from '../lib/clients/http_client/types';
import {RestClient} from '../lib/clients/rest/rest_client';
import {ApiVersion} from '../lib/types';
import {ConfigInterface} from '../lib/base-types';
import {Headers} from '../runtime/http';

import {IdSet, Body, ResourcePath, ParamSet} from './types';

interface BaseFindArgs {
  session: Session;
  params?: ParamSet;
  urlIds: IdSet;
}

interface BaseConstructorArgs {
  session: Session;
  fromData?: Body | null;
}

interface SaveArgs {
  update?: boolean;
}

interface RequestArgs extends BaseFindArgs {
  http_method: string;
  operation: string;
  body?: Body | null;
  entity?: Base | null;
}

interface GetPathArgs {
  http_method: string;
  operation: string;
  urlIds: IdSet;
  entity?: Base | null;
}

interface SetClassPropertiesArgs {
  Client: typeof RestClient;
  config: ConfigInterface;
}

export interface FindAllResponse<T = Base> {
  data: T[];
  headers: Headers;
  pageInfo?: PageInfo;
}

export class Base {
  // For instance attributes
  [key: string]: any;

  public static Client: typeof RestClient;
  public static config: ConfigInterface;

  public static apiVersion: string;
  protected static resourceName = '';
  protected static pluralName = '';
  protected static primaryKey = 'id';
  protected static customPrefix: string | null = null;
  protected static readOnlyAttributes: string[] = [];

  protected static hasOne: {[attribute: string]: typeof Base} = {};
  protected static hasMany: {[attribute: string]: typeof Base} = {};

  protected static paths: ResourcePath[] = [];

  public static setClassProperties({Client, config}: SetClassPropertiesArgs) {
    this.Client = Client;
    this.config = config;
  }

  protected static async baseFind<T extends Base = Base>({
    session,
    urlIds,
    params,
  }: BaseFindArgs): Promise<FindAllResponse<T>> {
    const response = await this.request<T>({
      http_method: 'get',
      operation: 'get',
      session,
      urlIds,
      params,
    });

    return {
      data: this.createInstancesFromResponse<T>(session, response.body as Body),
      headers: response.headers,
      pageInfo: response.pageInfo,
    };
  }

  protected static async request<T = unknown>({
    session,
    http_method,
    operation,
    urlIds,
    params,
    body,
    entity,
  }: RequestArgs): Promise<RestRequestReturn<T>> {
    const client = new this.Client({
      session,
      apiVersion: this.apiVersion as ApiVersion,
    });

    const path = this.getPath({http_method, operation, urlIds, entity});

    const cleanParams: {[key: string]: string | number} = {};
    if (params) {
      for (const key in params) {
        if (params[key] !== null) {
          cleanParams[key] = params[key];
        }
      }
    }

    switch (http_method) {
      case 'get':
        return client.get<T>({path, query: cleanParams});
      case 'post':
        return client.post<T>({
          path,
          query: cleanParams,
          data: body!,
          type: DataType.JSON,
        });
      case 'put':
        return client.put<T>({
          path,
          query: cleanParams,
          data: body!,
          type: DataType.JSON,
        });
      case 'delete':
        return client.delete<T>({path, query: cleanParams});
      default:
        throw new Error(`Unrecognized HTTP method "${http_method}"`);
    }
  }

  protected static getJsonBodyName(): string {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  protected static getPath({
    http_method,
    operation,
    urlIds,
    entity,
  }: GetPathArgs): string {
    let match: string | null = null;
    let specificity = -1;

    this.paths.forEach((path: ResourcePath) => {
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
        (_m1, _m2, id) => `${pathUrlIds[id]}`,
      );
    });

    if (!match) {
      throw new RestResourceError('Could not find a path for request');
    }

    if (this.customPrefix) {
      return `${this.customPrefix}/${match}`;
    } else {
      return match;
    }
  }

  protected static createInstancesFromResponse<T extends Base = Base>(
    session: Session,
    data: Body,
  ): T[] {
    if (data[this.pluralName] || Array.isArray(data[this.resourceName])) {
      return (data[this.pluralName] || data[this.resourceName]).reduce(
        (acc: T[], entry: Body) =>
          acc.concat(this.createInstance<T>(session, entry)),
        [],
      );
    }

    if (data[this.resourceName]) {
      return [this.createInstance<T>(session, data[this.resourceName])];
    }

    return [];
  }

  protected static createInstance<T extends Base = Base>(
    session: Session,
    data: Body,
    prevInstance?: T,
  ): T {
    const instance: T = prevInstance
      ? prevInstance
      : new (this as any)({session});

    if (data) {
      instance.setData(data);
    }

    return instance;
  }

  #session: Session;

  get session(): Session {
    return this.#session;
  }

  constructor({session, fromData}: BaseConstructorArgs) {
    this.#session = session;

    if (fromData) {
      this.setData(fromData);
    }
  }

  public async save({update = false}: SaveArgs = {}): Promise<void> {
    const {primaryKey, resourceName} = this.resource();
    const method = this[primaryKey] ? 'put' : 'post';

    const data = this.serialize(true);

    const response = await this.resource().request({
      http_method: method,
      operation: method,
      session: this.session,
      urlIds: {},
      body: {[this.resource().getJsonBodyName()]: data},
      entity: this,
    });

    const body: Body | undefined = (response.body as Body)[resourceName];

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

  public serialize(saving = false): Body {
    const {hasMany, hasOne, readOnlyAttributes} = this.resource();

    return Object.entries(this).reduce((acc: Body, [attribute, value]) => {
      if (
        ['#session'].includes(attribute) ||
        (saving && readOnlyAttributes.includes(attribute))
      ) {
        return acc;
      }

      if (attribute in hasMany && value) {
        acc[attribute] = value.reduce((attrAcc: Body, entry: Base) => {
          return attrAcc.concat(this.serializeSubAttribute(entry, saving));
        }, []);
      } else if (attribute in hasOne && value) {
        acc[attribute] = this.serializeSubAttribute(value, saving);
      } else {
        acc[attribute] = value;
      }

      return acc;
    }, {});
  }

  public toJSON(): Body {
    return this.serialize();
  }

  public request<T = unknown>(args: RequestArgs) {
    return this.resource().request<T>(args);
  }

  protected setData(data: Body): void {
    const {hasMany, hasOne} = this.resource();

    Object.entries(data).forEach(([attribute, val]) => {
      if (attribute in hasMany) {
        const HasManyResource: typeof Base = hasMany[attribute];
        this[attribute] = [];
        val.forEach((entry: Body) => {
          this[attribute].push(
            new HasManyResource({session: this.session, fromData: entry}),
          );
        });
      } else if (attribute in hasOne) {
        const HasOneResource: typeof Base = hasOne[attribute];
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

  private serializeSubAttribute(attribute: Base, saving: boolean): Body {
    return attribute.serialize
      ? attribute.serialize(saving)
      : this.resource()
          .createInstance(this.session, attribute)
          .serialize(saving);
  }
}
