import { PageInfo } from './page_info';
import { RequestReturn } from '../http_client';

type RestRequestReturn = RequestReturn & {
  pageInfo?: PageInfo,
};

export { RestRequestReturn };
