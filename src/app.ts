// 运行时配置
import type {RequestConfig} from 'umi';
import {getJwtToken, setJwtToken} from './utils/token';


export const request: RequestConfig = {
  requestInterceptors: [
    // 为所有请求添加 token
    (url, options) => {
      let headers: typeof options = {};

      // 除 POST /login 之外，所有请求都需要带上 token
      // 且设置默认 Content-Type 为 application/json
      if (url !== '/api/login') {
        headers = {
          Authorization: `Bearer ${getJwtToken()}`,
          'Content-Type': 'application/json',
        };
      }

      return {
        url,
        options: {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
        },
      };
    },
  ],

  responseInterceptors: [
    // 对于 200 的响应，将更新后的 token 保存到 Cookies 中
    (response) => {
      if (response.status === 200) {
        const token = response.headers.Authorization;
        if (token !== undefined) {
          setJwtToken(token);
        }
        return response;
      }

      if (response.status === 409) {
        return {...response, errCode: response.status};
      }

      return response;
    },
  ],
};
