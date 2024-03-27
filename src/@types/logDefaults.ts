import { defaultAccountInfo } from './accountDefaults';

export const defaultLogInfo: Log.LogInfo = {
  id: 0,
  timestamp: '',
  level: 'INFO',
  type: 'VIEW',
  operator: defaultAccountInfo,
  message: '',
  influencedEntities: [],
};
