import {SessionStorage} from '../../auth/session/session_storage';

export type AbstractCreateDefaultStorageFunc = () => SessionStorage;
