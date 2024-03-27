import { request } from '@umijs/max';

const logApi = {
  getAllLogs() {
    return request<Log.LogInfo[]>('/api/logs', {
      method: 'GET',
    });
  },

  getLog(id: number) {
    return request<Log.LogInfo>(`api/log/${id}`, {
      method: 'GET',
    });
  },
};

export default logApi;
