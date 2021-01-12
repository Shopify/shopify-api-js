import {RequestReturn} from '../http_client/types';

// require is a work-around for PageInfo dependency cycle
import PageInfo = require('./page_info/page_info');

type RestRequestReturn = RequestReturn & {
  pageInfo?: PageInfo.PageInfo;
};

export {RestRequestReturn};
