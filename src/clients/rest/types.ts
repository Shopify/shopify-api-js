import {RequestReturn} from '../http_client';

import {PageInfo} from './page_info';

type RestRequestReturn = RequestReturn & {
  pageInfo?: PageInfo;
};

export {RestRequestReturn};
